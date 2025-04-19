import React, { useEffect, useState } from "react";
import { getListScientificActivities } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { Undo2 } from "lucide-react";

export default function SRAListLayout() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getListScientificActivities();
        setActivities(data);
      } catch (error) {
        // Xử lý lỗi nếu cần
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="p-4">
    <div className="sticky top-0 bg-white z-10 flex  justify-between mb-4 pb-2">

    <button
        className=" bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        onClick={() => navigate(-1)}
      >
        <Undo2 />
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => navigate("/scientific-contracts")}
      >
        Thêm hoạt động mới
      </button>
    </div>
      <h2 className="text-xl font-bold mb-4">Danh sách hoạt động nghiên cứu khoa học</h2>
      {activities.length === 0 ? (
        <div>Không có dữ liệu.</div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="border rounded p-4 bg-white shadow">
              <div><b>Nội dung:</b> {activity.content}</div>
              <div className="mt-2">
                <b>Hướng dẫn:</b>
                {Array.isArray(activity.input) && activity.input.length > 0 ? (
                activity.input.map((inp, idx) => (
                    <div key={idx} className="ml-4 mt-2 border-l pl-2">
                    <div><b>Ghi chú:</b> {inp.note}</div>
                    <div><b>Minh chứng:</b> {inp.proof}</div>
                    <div>
                        <b>Cấp độ:</b>
                        <ul className="list-disc ml-6">
                        {inp.value &&
                            Object.entries(inp.value).map(([level, val]) => (
                            <li key={level}>
                                {level}: {val}
                            </li>
                            ))}
                        </ul>
                    </div>
                    </div>
                ))
                ) : (
                <div className="ml-4 mt-2 text-gray-400">Không có hướng dẫn</div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Tạo lúc: {new Date(activity.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}