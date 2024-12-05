import { collection, addDoc } from 'firebase/firestore';
import { fireDB } from '../firebase/firebaseConfig';
 ;

const uploadDataToFirestore = async (data) => {
    try {
        await addDoc(collection(fireDB, "jsonData"), data);
        console.log("Data successfully uploaded!");
    } catch (error) {
        console.error("Error uploading data: ", error);
    }
};

const fetchData = async () => {
    try {
        await uploadDataToFirestore(filejson);
        console.log("Done");
    } catch (error) {
        console.error('Error fetching the data:', error);
    }
};

fetchData();
