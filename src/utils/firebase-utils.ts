import { doc, getDoc, setDoc } from "firebase/firestore"
import { db9 } from "../firebase"

export const getCategories = async (email) => {
  const res = await getDoc(doc(db9, email, "categories"))
  if (res.exists) {
    return res.data().categories.sort((a, b) => a.localeCompare(b))
  }
  return []
}

export const checkIsNewUser = async (email) => {
  const res = await getDoc(doc(db9, email, "categories"))
  if (res.exists()) return
  await setDoc(doc(db9, email, "categories"), {
    categories: [],
  })
  await setDoc(doc(db9, "permissions", email), {
    authorizedCat: [],
    canWatch: [],
  })
}
