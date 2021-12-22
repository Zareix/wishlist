import { doc, getDoc } from "firebase/firestore"
import { db9 } from "../firebase"

export const getCategories = async (email) => {
  const res = await getDoc(doc(db9, email, "categories"))
  if (res.exists) {
    return res.data().categories.sort((a, b) => a.localeCompare(b))
  }
  return []
}
