import { useEffect, useState } from 'react';
import { fetchUserScientificResearch, fetchScientificResearchDetails, fetchMe } from '../api/api';

// Hook lấy thông tin user hiện tại
export function useCurrentUser() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getMe = async () => {
      try {
        const data = await fetchMe();
        setUser(data);
      } catch {
        setUser(null);
      }
    };
    getMe();
  }, []);
  return user;
}

// Hook lấy danh sách nghiên cứu của user theo id
export function useUserResearch(userId) {
  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResearch = async () => {
      setLoading(true);
      try {
        if (!userId) {
          setResearchList([]);
          setLoading(false);
          return;
        }
        const userResearch = await fetchUserScientificResearch(userId);
        const detailPromises = userResearch.map(async (item) => {
          const detail = await fetchScientificResearchDetails(item.scientific_research);
          return {
            ...detail,
            point: item.point,
            status: detail.status,
            created_at: detail.created_at,
          };
        });
        const allResearch = await Promise.all(detailPromises);
        setResearchList(allResearch);
      } catch {
        setResearchList([]);
      }
      setLoading(false);
    };
    fetchResearch();
  }, [userId]);

  return { researchList, loading };
}