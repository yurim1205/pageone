import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

interface BookmarkStore {
  bookmarks: string[];
  toggleBookmark: (isbn: string) => void;
  setBookmarks: (isbn: string[]) => void;
  loadBookmarks: (userId: string) => Promise<void>;
}

// set: 상태 변경
// get: 현재 상태 조회
export const useBookmarkStore = create<BookmarkStore>((set,get) => ({
  bookmarks: [],
  toggleBookmark: (isbn) => {
    const bookmarks  = get().bookmarks;

    if(bookmarks.includes(isbn)){
      set({ bookmarks: bookmarks.filter((b: string) => b !== isbn) });
    } else {
      set({ bookmarks: [...bookmarks, isbn] });
    }
  },
  setBookmarks: (isbn) => {
    set({ bookmarks: isbn });
  },
  loadBookmarks: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("scraps")
        .select("isbn")
        .eq("user_id", userId);

      if (error) {
        console.error("Load bookmarks error:", error);
        return;
      }

      const bookmarkIds = data?.map((item) => item.isbn) || [];
      set({ bookmarks: bookmarkIds });
    } catch (error) {
      console.error("Load bookmarks error:", error);
    }
  },
}));