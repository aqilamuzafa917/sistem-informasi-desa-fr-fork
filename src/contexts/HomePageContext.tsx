import * as React from "react";
import axios from "axios";
import { Article, ArticleResponse } from "@/types/desa";
import { API_CONFIG } from "@/config/api";

const CACHE_KEY = "home_articles_cache";
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes in milliseconds

interface CacheData {
  articles: Article[];
  timestamp: number;
}

interface HomePageContextType {
  articles: Article[];
  isLoading: boolean;
  refreshArticles: () => Promise<void>;
}

const HomePageContext = React.createContext<HomePageContextType | undefined>(
  undefined,
);

export function HomePageProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);

      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { articles: cachedArticles, timestamp }: CacheData =
          JSON.parse(cachedData);
        const isCacheValid = Date.now() - timestamp < CACHE_DURATION;

        if (isCacheValid) {
          setArticles(cachedArticles);
          setIsLoading(false);
          return;
        }
      }

      // If no cache or cache expired, fetch from API
      // First, fetch articles with specific IDs (1, 2, 3)
      const specificArticlesPromises = [1, 2, 3].map((id) =>
        axios.get<{ status: string; data: Article }>(
          `${API_CONFIG.baseURL}/api/publik/artikel/${id}`,
          { headers: API_CONFIG.headers },
        ),
      );

      const specificArticlesResponses = await Promise.all(
        specificArticlesPromises,
      );
      const specificArticles = specificArticlesResponses
        .filter((response) => response.data.status === "success")
        .map((response) => response.data.data)
        .filter((article) => article.jenis_artikel === "resmi");

      // Then, fetch latest articles
      const latestResponse = await axios.get<ArticleResponse>(
        `${API_CONFIG.baseURL}/api/publik/artikel?per_page=10`,
        { headers: API_CONFIG.headers },
      );

      let latestArticles: Article[] = [];
      if (latestResponse.data.status === "success") {
        latestArticles = latestResponse.data.data.data
          .filter(
            (article) =>
              article.jenis_artikel === "resmi" &&
              !specificArticles.some(
                (specific) => specific.id_artikel === article.id_artikel,
              ),
          )
          .slice(0, 2);
      }

      // Combine specific articles with latest articles
      const combinedArticles = [...specificArticles, ...latestArticles];

      // Save to cache
      const cacheData: CacheData = {
        articles: combinedArticles,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

      setArticles(combinedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchArticles();
  }, []);

  const value = {
    articles,
    isLoading,
    refreshArticles: fetchArticles,
  };

  return (
    <HomePageContext.Provider value={value}>
      {children}
    </HomePageContext.Provider>
  );
}

export function useHomePage() {
  const context = React.useContext(HomePageContext);
  if (context === undefined) {
    throw new Error("useHomePage must be used within a HomePageProvider");
  }
  return context;
}
