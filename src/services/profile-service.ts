import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { ResumeData, TemplateType } from "@/context/resume-config";

export interface ProfileDesign {
  themeColor: string;
  template: TemplateType;
  fontSize: number;
  sectionOrder: string[];
  showSections: {
    summary: boolean;
    experience: boolean;
    projects: boolean;
    skills: boolean;
    education: boolean;
  };
  portfolioTemplate?: string;
  avatarType?: string;
}

export interface UserProfile {
  id: string;
  slug: string;
  title: string;
  isPrimary: boolean;
  resumeData: ResumeData;
  design: ProfileDesign;
  updatedAt: any;
}

const COLLECTION_NAME = "profiles";

export const profileService = {
  // Get all profiles (for admin)
  async getProfiles(): Promise<UserProfile[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy("updatedAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
  },

  // Get primary profile (for home page)
  async getPrimaryProfile(): Promise<UserProfile | null> {
    const q = query(collection(db, COLLECTION_NAME), where("isPrimary", "==", true));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const docData = querySnapshot.docs[0];
    return { id: docData.id, ...docData.data() } as UserProfile;
  },

  // Get profile by slug
  async getProfileBySlug(slug: string): Promise<UserProfile | null> {
    if (!slug) return null;
    const q = query(collection(db, COLLECTION_NAME), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const docData = querySnapshot.docs[0];
    return { id: docData.id, ...docData.data() } as UserProfile;
  },

  // Save or update profile
  async saveProfile(profile: Partial<UserProfile>): Promise<void> {
    const id = profile.id || doc(collection(db, COLLECTION_NAME)).id;
    const docRef = doc(db, COLLECTION_NAME, id);
    
    const dataToSave = {
      ...profile,
      id,
      updatedAt: Timestamp.now()
    };

    await setDoc(docRef, dataToSave, { merge: true });
  },

  // Delete profile
  async deleteProfile(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  },

  // Set specific profile as primary
  async setPrimary(id: string): Promise<void> {
    const profiles = await this.getProfiles();
    
    // Batch update (manual since it's just a few docs)
    for (const p of profiles) {
      const docRef = doc(db, COLLECTION_NAME, p.id);
      await updateDoc(docRef, { isPrimary: p.id === id });
    }
  }
};
