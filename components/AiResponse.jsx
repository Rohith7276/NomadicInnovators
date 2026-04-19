import React, { useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { useGSAP } from "@gsap/react";
import Loader from "./Loader";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { useEffect } from "react";
import { gsap } from "gsap";

const SCHEDULES_STORAGE_KEY = "nomadic_itinerary_schedules";
const CURRENT_SCHEDULE_STORAGE_KEY = "nomadic_current_schedule_id";

function createEmptyDraft() {
    return {
        name: "",
        destination: "",
        days: "",
        budget: "",
        interests: "",
        travelStyle: "budget",
        startDate: "",
        status: "planned",
        itinerary: "",
        checklist: [],
    };
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function markdownToEditableHtml(markdownText) {
    const escaped = escapeHtml(markdownText || "");

    return escaped
        .replace(/^###\s+(.+)$/gm, "<h3>$1</h3>")
        .replace(/^##\s+(.+)$/gm, "<h2>$1</h2>")
        .replace(/^#\s+(.+)$/gm, "<h1>$1</h1>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/^-\s+(.+)$/gm, "<li>$1</li>")
        .replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>")
        .replace(/\n\n+/g, "</p><p>")
        .replace(/\n/g, "<br />")
        .replace(/^(?!<h\d|<ul|<li|<p|<table)(.+)$/gm, "<p>$1</p>")
        .replace(/<p><\/p>/g, "");
}

function normalizeItineraryForEditor(value) {
    const text = String(value || "").trim();
    if (!text) return "";

    const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(text);
    if (hasHtmlTags) return value;
    return markdownToEditableHtml(value);
}

function convertSingleTableHtmlToMarkdown(tableHtml) {
    if (typeof window === "undefined") return tableHtml;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = tableHtml;
    const table = wrapper.querySelector("table");
    if (!table) return tableHtml;

    const rows = Array.from(table.querySelectorAll("tr")).map((row) =>
        Array.from(row.querySelectorAll("th,td")).map((cell) =>
            cell.textContent?.replace(/\|/g, "\\|").trim() || ""
        )
    );

    if (rows.length === 0) return "";

    const header = rows[0];
    const divider = header.map(() => "---");
    const bodyRows = rows.slice(1);

    const lines = [
        `| ${header.join(" | ")} |`,
        `| ${divider.join(" | ")} |`,
        ...bodyRows.map((row) => `| ${row.join(" | ")} |`),
    ];

    return `\n${lines.join("\n")}\n`;
}

function htmlToMarkdownForPreview(htmlContent) {
    const source = String(htmlContent || "");
    if (!source) return "";

    const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(source);
    if (!hasHtmlTags) return source;

    let markdown = source.replace(/<table[\s\S]*?<\/table>/gi, (match) => convertSingleTableHtmlToMarkdown(match));

    markdown = markdown
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/?p>/gi, "\n")
        .replace(/<\/?div>/gi, "\n")
        .replace(/<li>/gi, "- ")
        .replace(/<\/li>/gi, "\n")
        .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "# $1\n")
        .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "## $1\n")
        .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "### $1\n")
        .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
        .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    return markdown;
}

function extractPlaceTextFromTimedLine(line, bestTime, nextLine = "") {
    let placeText = line
        .replace(/^[-*]\s+/, "")
        .replace(/^\d+\.\s+/, "")
        .replace(new RegExp(`^${bestTime}\\s*[:\-]?\\s*`, "i"), "")
        .replace(new RegExp(`\\b(in the|during the|at)\\s+${bestTime}\\b`, "i"), "")
        .replace(/\s{2,}/g, " ")
        .trim();

    if (placeText.length < 6 || /^[:\-\s]*$/.test(placeText)) {
        const fallback = String(nextLine || "")
            .replace(/^[-*]\s+/, "")
            .replace(/^\d+\.\s+/, "")
            .trim();

        if (fallback.length >= 6) {
            placeText = fallback;
        }
    }

    return placeText;
}

function extractChecklistFromItinerary(itinerary) {
    if (!itinerary || typeof itinerary !== "string") {
        return [];
    }

    const plainText = itinerary
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<\/div>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ");

    const lines = plainText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    const checklist = [];

    for (let i = 0; i < lines.length; i++) {
        const rawLine = lines[i];
        if (checklist.length >= 14) break;

        const normalized = rawLine
            .replace(/^[-*]\s+/, "")
            .replace(/^\d+\.\s+/, "")
            .trim();

        if (!normalized || normalized.length < 8) continue;

        const lower = normalized.toLowerCase();

        if (lower.startsWith("day ")) continue;
        if (lower.includes("cost breakdown") || lower.includes("entry fees") || lower.includes("transport") || lower.includes("food:")) continue;
        if (lower.includes("output format") || lower.includes("requirements")) continue;

        let bestTime = "";
        if (lower.includes("morning")) bestTime = "morning";
        else if (lower.includes("afternoon")) bestTime = "afternoon";
        else if (lower.includes("evening")) bestTime = "evening";
        else if (lower.includes("night")) bestTime = "night";

        // Keep checklist strictly time-based.
        if (!bestTime) continue;

        const nextLine = lines[i + 1] || "";
        const placeText = extractPlaceTextFromTimedLine(normalized, bestTime, nextLine);

        if (!placeText || placeText.length < 6) continue;

        const title = `${bestTime.charAt(0).toUpperCase()}${bestTime.slice(1)} - ${placeText}`;

        checklist.push({
            id: `auto-${checklist.length + 1}`,
            title,
            bestTime,
            done: false,
        });
    }

    return checklist;
}

function getCurrentTimeSlot(now = new Date()) {
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
}

function pickRecommendedStop(checklist, slot) {
    const pending = checklist.filter((item) => !item.done);
    if (pending.length === 0) return null;

    const slotMatch = pending.find((item) => item.bestTime === slot);
    if (slotMatch) return slotMatch;

    return pending[0];
}

function pickNextStop(checklist, recommendedId) {
    const pending = checklist.filter((item) => !item.done);
    if (pending.length <= 1) return null;

    const index = pending.findIndex((item) => item.id === recommendedId);
    if (index === -1) return pending[1] || null;
    return pending[index + 1] || null;
}

function ChatApp() {
    const [destination, setDestination] = useState("");
    const [days, setDays] = useState("");
    const [budget, setBudget] = useState("");
    const [interests, setInterests] = useState("");
    const [travelStyle, setTravelStyle] = useState("budget");
    const [response, setResponse] = useState("");
    const [relatedLinks, setRelatedLinks] = useState([]);
    const [error, setError] = useState("");
    const [scheduleMessage, setScheduleMessage] = useState("");
    const [schedules, setSchedules] = useState([]);
    const [currentScheduleId, setCurrentScheduleId] = useState("");
    const [scheduleDraft, setScheduleDraft] = useState(createEmptyDraft());
    const [editingScheduleId, setEditingScheduleId] = useState("");
    const [isScheduleEditorVisible, setIsScheduleEditorVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    const itineraryEditorRef = useRef(null);
    const { contextSafe } = useGSAP();
    useEffect(() => {
        const animation = contextSafe(() => {
            if (typeof document !== "undefined") {
                Array.from(document.getElementsByClassName("aiRes")).forEach(element => {
                    element.style.opacity = 1;
                });
            }
            gsap.from(".aiRes", {
                y: 20,
                opacity: 0,
                stagger: 0.2
            })
        });

        animation();
    }, [response])

    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const savedSchedules = localStorage.getItem(SCHEDULES_STORAGE_KEY);
            const savedCurrentId = localStorage.getItem(CURRENT_SCHEDULE_STORAGE_KEY);

            if (savedSchedules) {
                const parsed = JSON.parse(savedSchedules);
                if (Array.isArray(parsed)) {
                    setSchedules(parsed);
                }
            }

            if (savedCurrentId) {
                setCurrentScheduleId(savedCurrentId);
            }
        } catch (storageError) {
            console.error("Failed to load schedules", storageError);
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            localStorage.setItem(SCHEDULES_STORAGE_KEY, JSON.stringify(schedules));
            localStorage.setItem(CURRENT_SCHEDULE_STORAGE_KEY, currentScheduleId || "");
        } catch (storageError) {
            console.error("Failed to save schedules", storageError);
        }
    }, [schedules, currentScheduleId]);

    useEffect(() => {
        if (!itineraryEditorRef.current) return;
        const nextValue = scheduleDraft.itinerary || "";
        if (itineraryEditorRef.current.innerHTML !== nextValue) {
            itineraryEditorRef.current.innerHTML = nextValue;
        }
    }, [scheduleDraft.itinerary]);

    const currentSchedule = schedules.find((schedule) => schedule.id === currentScheduleId) || null;
    const currentChecklist = currentSchedule
        ? (Array.isArray(currentSchedule.checklist) && currentSchedule.checklist.length > 0
            ? currentSchedule.checklist
            : extractChecklistFromItinerary(currentSchedule.itinerary || ""))
        : [];
    const currentTimeSlot = getCurrentTimeSlot();
    const recommendedStop = pickRecommendedStop(currentChecklist, currentTimeSlot);
    const nextStop = recommendedStop ? pickNextStop(currentChecklist, recommendedStop.id) : null;
    const currentSchedulePreviewMarkdown = currentSchedule
        ? htmlToMarkdownForPreview(currentSchedule.itinerary || "")
        : "";

    const markdownComponents = {
        strong: ({ children }) => <strong className="font-extrabold">{children}</strong>,
        em: ({ children }) => <em className="not-italic font-semibold">{children}</em>,
        table: ({ children }) => (
            <div className="my-3 overflow-x-auto">
                <table className="min-w-full border border-[#9fc1d6] dark:border-[#7a3d1a] text-left text-[0.98rem]">
                    {children}
                </table>
            </div>
        ),
        th: ({ children }) => (
            <th className="border border-[#9fc1d6] dark:border-[#7a3d1a] px-3 py-2 bg-[#ebf6ff] dark:bg-[#3b1908] font-bold">
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td className="border border-[#9fc1d6] dark:border-[#7a3d1a] px-3 py-2 align-top">
                {children}
            </td>
        ),
    };

    const checklistMarkdownComponents = {
        ...markdownComponents,
        p: ({ children }) => <span>{children}</span>,
    };

    const handleSendMessage = async () => {

        if (!destination.trim() || !days || !budget) {
            setError("Please fill destination, days, and budget.");
            return;
        }

        setError("");
        setRelatedLinks([]);

        setLoading(true);
        const darkScroll = document.querySelector(".scrollBrown");
        const lightScroll = document.querySelector(".scrollLight");
        darkScroll?.scrollTo({ top: 0, behavior: "smooth" });
        lightScroll?.scrollTo({ top: 0, behavior: "smooth" });
        try {
            const res = await fetch("/api/itinerary", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    destination,
                    days,
                    budget,
                    interests,
                    travelStyle,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setResponse("");
                setError(data?.error || "Failed to generate itinerary.");
                setLoading(false);
                return;
            }
            setResponse(data.response);
            setRelatedLinks(Array.isArray(data?.relatedLinks) ? data.relatedLinks : []);
            setLoading(false);
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred while communicating with the server.");
            setResponse("");
            setRelatedLinks([]);
            setLoading(false);
        }

    };

    const applySample = () => {
        setDestination("Goa");
        setDays("3");
        setBudget("10000");
        setInterests("beaches, nightlife, food");
        setTravelStyle("budget");
    };

    const applyGeneratedToDraft = () => {
        setScheduleDraft({
            name: destination ? `${destination} Trip Plan` : "My Trip Plan",
            destination,
            days,
            budget,
            interests,
            travelStyle,
            startDate: "",
            status: "planned",
            itinerary: normalizeItineraryForEditor(response),
        });
        setEditingScheduleId("");
        setIsScheduleEditorVisible(true);
        setScheduleMessage("Itinerary copied to schedule draft. You can edit and save it.");
    };

    const updateDraftField = (field, value) => {
        setScheduleDraft((prev) => ({ ...prev, [field]: value }));
    };

    const saveSchedule = () => {
        if (!scheduleDraft.name.trim() || !scheduleDraft.destination.trim()) {
            setScheduleMessage("Schedule name and destination are required.");
            return;
        }

        const now = new Date().toISOString();

        if (editingScheduleId) {
            setSchedules((prev) =>
                prev.map((item) =>
                    item.id === editingScheduleId
                        ? {
                            ...item,
                            ...scheduleDraft,
                            checklist: Array.isArray(item.checklist) && item.checklist.length > 0
                                ? item.checklist
                                : extractChecklistFromItinerary(scheduleDraft.itinerary),
                            updatedAt: now,
                        }
                        : item
                )
            );
            setScheduleDraft(createEmptyDraft());
            setEditingScheduleId("");
            setIsScheduleEditorVisible(false);
            setScheduleMessage("Schedule updated.");
            return;
        }

        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const newSchedule = {
            id,
            ...scheduleDraft,
            checklist: extractChecklistFromItinerary(scheduleDraft.itinerary),
            createdAt: now,
            updatedAt: now,
        };

        setSchedules((prev) => [newSchedule, ...prev]);
        setCurrentScheduleId(id);
        setEditingScheduleId("");
        setScheduleDraft(createEmptyDraft());
        setIsScheduleEditorVisible(false);
        setScheduleMessage("Schedule created and set as current.");
    };

    const startNewDraft = () => {
        setEditingScheduleId("");
        setScheduleDraft(createEmptyDraft());
        setIsScheduleEditorVisible(true);
        setScheduleMessage("Started a new blank schedule draft.");
    };

    const editSchedule = (id) => {
        const selected = schedules.find((item) => item.id === id);
        if (!selected) return;

        setEditingScheduleId(id);
        setScheduleDraft({
            name: selected.name || "",
            destination: selected.destination || "",
            days: selected.days || "",
            budget: selected.budget || "",
            interests: selected.interests || "",
            travelStyle: selected.travelStyle || "budget",
            startDate: selected.startDate || "",
            status: selected.status || "planned",
            itinerary: normalizeItineraryForEditor(selected.itinerary || ""),
        });
        setIsScheduleEditorVisible(true);
        setScheduleMessage("Loaded schedule into editor.");
    };

    const setAsCurrent = (id) => {
        setCurrentScheduleId(id);
        setScheduleMessage("Current schedule updated.");
    };

    const deleteSchedule = (id) => {
        setSchedules((prev) => prev.filter((item) => item.id !== id));
        if (currentScheduleId === id) {
            setCurrentScheduleId("");
        }
        if (editingScheduleId === id) {
            setEditingScheduleId("");
            setScheduleDraft(createEmptyDraft());
            setIsScheduleEditorVisible(false);
        }
        setScheduleMessage("Schedule deleted.");
    };

    const toggleChecklistItem = (scheduleId, checklistItemId) => {
        const now = new Date().toISOString();
        setSchedules((prev) =>
            prev.map((item) => {
                if (item.id !== scheduleId) return item;

                const baseChecklist = Array.isArray(item.checklist) && item.checklist.length > 0
                    ? item.checklist
                    : extractChecklistFromItinerary(item.itinerary || "");

                const updatedChecklist = baseChecklist.map((check) =>
                    check.id === checklistItemId
                        ? { ...check, done: !check.done }
                        : check
                );

                return {
                    ...item,
                    checklist: updatedChecklist,
                    updatedAt: now,
                };
            })
        );
    };

    return (
        <div className="w-[92vw] lg:w-[80vw] mx-auto">
            <div className="rounded-2xl border border-[#6e8a9b] dark:border-[#7a3d1a] p-4 lg:p-6 bg-gradient-to-br from-[#e6f4ff] via-[#f6fbff] to-[#fffaf2] dark:from-[#3e210f] dark:via-[#4F2109] dark:to-[#2f1609] shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                    <h2 className="text-2xl lg:text-3xl font-semibold text-[#022236] dark:text-[#ffd867]">Smart Itinerary Generator</h2>
                    <button onClick={applySample} className="px-3 py-1 rounded-full text-sm border border-[#1d4d6a] dark:border-[#ffd867] text-[#123f5a] dark:text-[#ffd867] hover:bg-[#dceffd] dark:hover:bg-[#6a2f0d]">Use Sample Input</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-end">
                    <input
                        className="w-full p-3 rounded-xl border border-[#8cb0c5] bg-white text-black outline-none"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Destination (e.g., Goa)"
                />
                <input
                    type="number"
                    min="1"
                    className="w-full p-3 rounded-xl border border-[#8cb0c5] bg-white text-black outline-none"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="Days (e.g., 3)"
                />
                <input
                    type="number"
                    min="1"
                    className="w-full p-3 rounded-xl border border-[#8cb0c5] bg-white text-black outline-none"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Budget in INR (e.g., 10000)"
                />
                <select
                    className="w-full p-3 rounded-xl border border-[#8cb0c5] bg-white text-black outline-none"
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                >
                    <option value="budget">budget</option>
                    <option value="mid-range">mid-range</option>
                    <option value="luxury">luxury</option>
                </select>
                <input
                    className="w-full p-3 rounded-xl border border-[#8cb0c5] bg-white text-black outline-none lg:col-span-2"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="Interests (comma separated: beaches, nightlife, food)"
                />
                <div className="lg:col-span-2 flex justify-end">
                    <button onClick={handleSendMessage} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#123f5a] dark:bg-[#ffd867] text-white dark:text-[#1a1a1a] font-semibold hover:opacity-90">
                        Generate Itinerary
                        <IoSend className="curZ" />
                    </button>
                </div>
                </div>
            </div>

            {error && <p className="text-red-600 text-center mt-3">{error}</p>}

            {loading && <div className="mt-6 flex justify-center"><Loader /></div>}
     {relatedLinks.length > 0 && (
                <div className="mt-6 bg-white dark:bg-[#2a1106] border border-[#c0d8e8] dark:border-[#7a3d1a] rounded-2xl p-4">
                    <h3 className="text-lg font-semibold text-[#022236] dark:text-[#ffd867] mb-3">Related Links From Our Website</h3>
                    <div className="flex flex-wrap gap-2">
                        {relatedLinks.map((link, idx) => (
                            <a
                                key={`${link.href}-${idx}`}
                                href={link.href}
                                target={link.href.startsWith("http") ? "_blank" : "_self"}
                                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                className="px-3 py-2 rounded-full border border-[#1d4d6a] dark:border-[#ffd867] text-[#123f5a] dark:text-[#ffd867] hover:bg-[#ebf6ff] dark:hover:bg-[#4b2107]"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
{response &&<>
            <div className="h-[60vh] my-6 px-4 scrollBrown hidden dark:block overflow-y-scroll text-[1.15rem] leading-8 w-full py-7 mx-auto rounded-2xl border border-[#3c230f] bg-[#120a06] text-[#f6e8dc]">
                <div className="prose prose-invert max-w-none prose-p:text-[1.12rem] prose-li:text-[1.12rem] prose-strong:font-extrabold prose-strong:text-[#ffe0bd] prose-em:not-italic prose-em:font-semibold prose-em:text-[#ffd7a6]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {response}
                    </ReactMarkdown>
                </div>
            </div>

            <div className="h-[60vh] dark:hidden my-6 px-4 scrollLight overflow-y-scroll text-[1.15rem] leading-8 w-full py-7 mx-auto rounded-2xl border border-[#b8d2e3] bg-[#ffffff] text-[#102938]">
                <div className="prose max-w-none prose-p:text-[1.12rem] prose-li:text-[1.12rem] prose-headings:text-[#0f3a53] prose-strong:text-[#0f3a53] prose-strong:font-extrabold prose-em:not-italic prose-em:font-semibold prose-em:text-[#184e72]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {response}
                    </ReactMarkdown>
                </div>

            </div></>}
            {response && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={applyGeneratedToDraft}
                        className="px-4 py-2 rounded-xl border border-[#1d4d6a] dark:border-[#ffd867] text-[#123f5a] dark:text-[#ffd867] hover:bg-[#ebf6ff] dark:hover:bg-[#4b2107]"
                    >
                        I Like This Itinerary, Create Schedule
                    </button>
                </div>
            )}

            <div className="mt-6 flex justify-end">
                {!isScheduleEditorVisible && (
                    <button
                        onClick={startNewDraft}
                        className="px-4 py-2 rounded-xl dark:border   dark:border-[#ffd867] text-white hover:text-[#123f5a] dark:text-[#ffd867] bg-[#123f5a] dark:bg-inherit  hover:bg-[#ebf6ff] dark:hover:bg-[#4b2107]"
                    >
                        Create New Schedule
                    </button>
                )}
            </div>

            {scheduleMessage && (
                <p className="text-sm mt-3 mb-1 text-[#22495f] dark:text-[#ffdba0]">{scheduleMessage}</p>
            )}

            {isScheduleEditorVisible && (
                <div className="mt-3 bg-white dark:bg-[#2a1106] border border-[#c0d8e8] dark:border-[#7a3d1a] rounded-2xl p-4 lg:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h3 className="text-lg font-semibold text-[#022236] dark:text-[#ffd867]">Schedule Editor</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setIsScheduleEditorVisible(false);
                                    setEditingScheduleId("");
                                    setScheduleDraft(createEmptyDraft());
                                }}
                                className="px-3 py-1 rounded-lg border border-[#1d4d6a] dark:border-[#ffd867] text-[#123f5a] dark:text-[#ffd867]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveSchedule}
                                className="px-3 py-1 rounded-lg bg-[#123f5a] dark:bg-[#ffd867] text-white dark:text-[#1a1a1a]"
                            >
                                {editingScheduleId ? "Update Schedule" : "Save Schedule"}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <input
                        className="w-full p-3 rounded-xl border border-[#8cb0c5] bg-white text-black outline-none"
                        value={scheduleDraft.name}
                        onChange={(e) => updateDraftField("name", e.target.value)}
                        placeholder="Schedule name"
                    />
                    <input
                        className="w-full p-3 rounded-xl border border-[#8cb0c5] bg-white text-black outline-none"
                        value={scheduleDraft.destination}
                        onChange={(e) => updateDraftField("destination", e.target.value)}
                        placeholder="Destination"
                    />
                    <input
                        type="number"
                        min="1"
                        className="w-full p-3 rounded-xl border border-[#8cb0c5] bg-white text-black outline-none"
                        value={scheduleDraft.days}
                        onChange={(e) => updateDraftField("days", e.target.value)}
                        placeholder="Days"
                    />
                    <input
                        type="number"
                        min="1"
                        className="w-full p-3 rounded-xl border border-[#8cb0c5] bg-white text-black outline-none"
                        value={scheduleDraft.budget}
                        onChange={(e) => updateDraftField("budget", e.target.value)}
                        placeholder="Budget"
                    />
                    <select
                        className="w-full p-3 rounded-xl border border-[#8cb0c5] bg-white text-black outline-none"
                        value={scheduleDraft.travelStyle}
                        onChange={(e) => updateDraftField("travelStyle", e.target.value)}
                    >
                        <option value="budget">budget</option>
                        <option value="mid-range">mid-range</option>
                        <option value="luxury">luxury</option>
                    </select>
                    <select
                        className="w-full p-3 rounded-xl border border-[#8cb0c5] bg-white text-black outline-none"
                        value={scheduleDraft.status}
                        onChange={(e) => updateDraftField("status", e.target.value)}
                    >
                        <option value="planned">planned</option>
                        <option value="active">active</option>
                        <option value="completed">completed</option>
                    </select>
                    <input
                        type="date"
                        className="w-full p-3 rounded-xl border border-[#8cb0c5] bg-white text-black outline-none"
                        value={scheduleDraft.startDate}
                        onChange={(e) => updateDraftField("startDate", e.target.value)}
                    />
                    <input
                        className="w-full p-3 rounded-xl border border-[#8cb0c5] bg-white text-black outline-none"
                        value={scheduleDraft.interests}
                        onChange={(e) => updateDraftField("interests", e.target.value)}
                        placeholder="Interests"
                    />
                    <div className="lg:col-span-2">
                        <p className="text-sm font-semibold mb-2 text-[#22495f] dark:text-[#ffdba0]">Itinerary (Rich Editable)</p>
                        <div
                            ref={itineraryEditorRef}
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) => updateDraftField("itinerary", e.currentTarget.innerHTML)}
                            className="min-h-[220px] w-full p-3 rounded-xl border border-[#8cb0c5] bg-white text-black outline-none leading-7 text-[1.06rem] overflow-y-auto"
                        />
                        {!scheduleDraft.itinerary && (
                            <p className="text-xs mt-2 text-[#3f6277] dark:text-[#ffdba0]">Paste AI itinerary or type here. Use Ctrl+B for bold and Ctrl+I for semi-bold emphasis.</p>
                        )}
                    </div>
                    </div>
                </div>
            )}

            <div className="mt-6 bg-white dark:bg-[#2a1106] border border-[#c0d8e8] dark:border-[#7a3d1a] rounded-2xl p-4 lg:p-5 text-xl">
                <h3 className="text-lg font-semibold text-[#022236] dark:text-[#ffd867] mb-3">Current Schedule</h3>
                {!currentSchedule && (
                    <p className="text-[#22495f] dark:text-[#ffdba0]">No current schedule selected yet.</p>
                )}
                {currentSchedule && (
                    <div className="rounded-xl border border-[#9fc1d6] dark:border-[#7a3d1a] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="text-xl font-semibold text-[#123f5a] dark:text-[#ffd867]">{currentSchedule.name}</h4>
                            <span className="px-3 py-1 rounded-full text-sm border border-[#6b97b4] dark:border-[#ffd867] text-[#123f5a] dark:text-[#ffd867]">{currentSchedule.status}</span>
                        </div>
                        <p className="mt-2 text-[#123f5a] dark:text-[#ffdba0]">
                            {currentSchedule.destination} | {currentSchedule.days || "-"} days | Budget: {currentSchedule.budget || "-"}
                        </p>
                        <p className="text-[#123f5a] dark:text-[#ffdba0]">Start date: {currentSchedule.startDate || "Not set"}</p>

                        {currentSchedule.itinerary && (
                            <div className="mt-4 rounded-xl border border-[#9fc1d6] dark:border-[#7a3d1a] p-3 bg-white dark:bg-[#2a1106]">
                                <p className="text-sm font-semibold text-[#123f5a] dark:text-[#ffd867] mb-2">Schedule Itinerary Preview</p>
                                <div className="prose text-black dark:text-white max-w-none overflow-x-auto prose-p:text-[1.05rem] prose-li:text-[1.05rem] prose-headings:text-[#0f3a53] prose-strong:text-[#0f3a53] prose-strong:font-extrabold prose-em:not-italic prose-em:font-semibold dark:prose-invert dark:prose-strong:text-[#ffe0bd] dark:prose-em:text-[#ffd7a6]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                        {currentSchedulePreviewMarkdown}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}

                        <div className="mt-4 rounded-xl border border-[#9fc1d6] dark:border-[#7a3d1a] p-3 bg-[#f2f9ff] dark:bg-[#361607]">
                            <p className="text-sm font-semibold text-[#123f5a] dark:text-[#ffd867]">Right now ({currentTimeSlot})</p>
                            {!recommendedStop && currentChecklist.length > 0 && (
                                <p className="text-[#123f5a] dark:text-[#ffdba0] mt-1">All checklist stops are completed. Great work.</p>
                            )}
                            {!recommendedStop && currentChecklist.length === 0 && (
                                <p className="text-[#123f5a] dark:text-[#ffdba0] mt-1">No checklist generated yet. Save itinerary details to auto-build stops.</p>
                            )}
                            {recommendedStop && (
                                <p className="text-[#123f5a] dark:text-[#ffdba0] mt-1">Go to: <span className="font-semibold">{recommendedStop.title}</span></p>
                            )}
                            {nextStop && (
                                <p className="text-[#123f5a] dark:text-[#ffdba0] mt-1">Next after this: <span className="font-semibold">{nextStop.title}</span></p>
                            )}
                        </div>

                        {currentChecklist.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-semibold text-[#123f5a] dark:text-[#ffd867] mb-2">Checklist</p>
                                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 text-xl">
                                    {currentChecklist.map((item) => (
                                        <label key={item.id} className="flex items-start gap-2 rounded-lg border border-[#b8d2e3] dark:border-[#7a3d1a] p-2 bg-white dark:bg-[#2a1106]">
                                            <input
                                                type="checkbox"
                                                checked={Boolean(item.done)}
                                                onChange={() => toggleChecklistItem(currentSchedule.id, item.id)}
                                                className="mt-1 cursor-pointer w-6"
                                            />
                                            <div className={` leading-6 ${item.done ? "line-through text-gray-500" : "text-[#123f5a] dark:text-[#ffdba0]"}`}>
                                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={checklistMarkdownComponents}>
                                                    {item.title}
                                                </ReactMarkdown>
                                                {item.bestTime && item.bestTime !== "anytime" ? ` (${item.bestTime})` : ""}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-6 bg-white dark:bg-[#2a1106] border border-[#c0d8e8] dark:border-[#7a3d1a] rounded-2xl p-4 lg:p-5">
                <h3 className="text-lg font-semibold text-[#022236] dark:text-[#ffd867] mb-3">Saved Schedules</h3>
                {schedules.length === 0 && (
                    <p className="text-[#22495f] dark:text-[#ffdba0]">No saved schedules yet.</p>
                )}
                <div className="space-y-3">
                    {schedules.map((item) => (
                        <div key={item.id} className="rounded-xl border border-[#9fc1d6] dark:border-[#7a3d1a] p-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                            <div>
                                <h4 className="font-semibold text-[#123f5a] dark:text-[#ffd867]">{item.name}</h4>
                                <p className="text-sm text-[#22495f] dark:text-[#ffdba0]">{item.destination} | {item.days || "-"} days</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => editSchedule(item.id)} className="px-3 py-1 rounded-lg border border-[#1d4d6a] dark:border-[#ffd867] text-[#123f5a] dark:text-[#ffd867]">Edit</button>
                                <button onClick={() => setAsCurrent(item.id)} className="px-3 py-1 rounded-lg border border-[#1d4d6a] dark:border-[#ffd867] text-[#123f5a] dark:text-[#ffd867]">Set Current</button>
                                <button onClick={() => deleteSchedule(item.id)} className="px-3 py-1 rounded-lg border border-red-600 text-red-600">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

       
        </div>
    );
}

export default ChatApp;
