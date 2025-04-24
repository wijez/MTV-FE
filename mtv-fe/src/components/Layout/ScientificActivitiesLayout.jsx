import React, { useState } from 'react';
import { submitScientificActivities } from '../../api/api';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Undo2 } from 'lucide-react';

export default function ScientificActivitiesLayout() {
  const [activities, setActivities] = useState([
    {
      group: "",
      content: "",
      input: [
        {
          note: "",
          proof: "",
          value: {
          },
        },
      ],
    },
  ]);

  const [newKey, setNewKey] = useState(""); 
  const [editingKey, setEditingKey] = useState({ activityIndex: null, inputIndex: null }); // Trạng thái để theo dõi vị trí đang thêm key

  const navigate = useNavigate(); 

  const handleInputChange = (activityIndex, inputIndex, key, value) => {
    setActivities((prev) => {
      const updatedActivities = [...prev];
      if (inputIndex === null) {
        updatedActivities[activityIndex][key] = value; // Không thay thế giá trị rỗng
      } else {
        updatedActivities[activityIndex].input[inputIndex][key] = value;
      }
      return updatedActivities;
    });
  };

  
  const handleValueChange = (activityIndex, inputIndex, key, value) => {
    setActivities((prev) => {
      const updatedActivities = [...prev];
      updatedActivities[activityIndex].input[inputIndex].value[key] = value;
      return updatedActivities;
    });
  };

  const handleAddKeyValue = (activityIndex, inputIndex) => {
    setEditingKey({ activityIndex, inputIndex }); 
  };

  const handleSaveKey = () => {
    if (newKey.trim() !== "") {
      setActivities((prev) => {
        const updatedActivities = [...prev];
        const { activityIndex, inputIndex } = editingKey;
        updatedActivities[activityIndex].input[inputIndex].value[newKey] = "";
        return updatedActivities;
      });
      setNewKey(""); // Reset key mới
      setEditingKey({ activityIndex: null, inputIndex: null }); // Đặt lại trạng thái
    }
  };

  const handleRemoveKeyValue = (activityIndex, inputIndex, key) => {
    setActivities((prev) => {
      const updatedActivities = [...prev];
      delete updatedActivities[activityIndex].input[inputIndex].value[key];
      return updatedActivities;
    });
  };

  const handleAddActivity = () => {
    setActivities((prev) => [
      ...prev,
      {
        group: "RESEARCH_PROJECTS",
        content: "",
        input: [
          {
            note: "",
            proof: "",
            value: {},
          },
        ],
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Kiểm tra dữ liệu trước khi gửi
    const validatedActivities = activities.map((activity) => {
      // Đảm bảo group không rỗng
      if (!activity.group.trim()) {
        toast.error("Vui lòng chọn nhóm cho tất cả các hoạt động!");
        throw new Error("Group is required");
      }
  
      // Chuyển đổi giá trị trong value sang số
      const validatedInputs = activity.input.map((input) => ({
        ...input,
        value: Object.fromEntries(
          Object.entries(input.value).map(([key, val]) => [key, Number(val)])
        ),
      }));
  
      return {
        ...activity,
        input: validatedInputs,
      };
    });
  
    try {
      for (const activity of validatedActivities) {
        const payload = {
          group: activity.group,
          content: activity.content,
          input: activity.input,
        };
  
        const response = await submitScientificActivities(payload);
        console.log("Response:", response);
      }
  
      toast.success("Dữ liệu đã được gửi thành công!");
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi gửi dữ liệu."
      );
    }
  };

  return (
    <>
    <div className='p-4'>
    <div className="sticky top-0 bg-white z-10 flex  justify-between mb-4 pb-2">
    <button
        className=" bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        onClick={() => navigate(-1)}
      >
        <Undo2 />
      </button>
      <h2 className="flex-1 text-xl text-center font-bold mb-4 scroll-auto">Hướng dẫn về nghiên cứu khoa học</h2>
    </div>
    </div>
    <div className="p-6 bg-gray-100 min-h-screen">

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        {activities.map((activity, activityIndex) => (
          <div key={activityIndex} className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Hoạt Động Nghiên cứu</h3>

            {/* Group */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Nhóm</label>
              <select
                 value={activity.group}
                 onChange={(e) =>
                   handleInputChange(activityIndex, null, "group", e.target.value)
                 }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">--Chọn Nhóm đề tài--</option>
                <option value="RESEARCH_PROJECTS">Nhóm đề tài NCKH</option>
                <option value="ARTICLES_BOOKS">Nhóm bài viết, sách</option>
                <option value="STUDENT_GUIDANCE">Nhóm hướng dẫn sinh viên</option>
                <option value="WORKS_PUBLICATIONS">Nhóm công trình, tác phẩm GV</option>
                <option value="OTHER_ACTIVITIES">Nhóm hoạt động khác</option>
              </select>
            </div>
           

            {/* Content */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Nội Dung</label>
              <input
                type="text"
                value={activity.content}
                onChange={(e) =>
                  handleInputChange(activityIndex, null, "content", e.target.value)
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {activity.input.map((input, inputIndex) => (
              <div key={inputIndex} className="mb-4">

                {/* Note */}
                <div className="mb-2">
                  <label className="block text-gray-700 font-medium mb-1">Ghi Chú</label>
                  <textarea
                    value={input.note}
                    onChange={(e) =>
                      handleInputChange(activityIndex, inputIndex, "note", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  ></textarea>
                </div>

                {/* Proof */}
                <div className="mb-2">
                  <label className="block text-gray-700 font-medium mb-1">Minh Chứng</label>
                  <textarea
                    value={input.proof}
                    onChange={(e) =>
                      handleInputChange(activityIndex, inputIndex, "proof", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  ></textarea>
                </div>

                {/* Dynamic Key-Value Pairs */}
                <div className="mb-4">
                  <h5 className="font-medium mb-2">Cấp độ</h5>
                  <h6 className='from-inherit'>(Nhập thông tin các cấp độ nghiên cứu, cách tính cho từng nghiên cứu)</h6>
                  {Object.keys(input.value).map((key) => (
                    <div key={key} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={key}
                        readOnly
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault(); 
                          }
                        }}
                        className="w-1/3 border border-gray-300 rounded px-3 py-2 bg-gray-100"
                      />
                      <input
                        type="number"
                        value={input.value[key]}
                        onChange={(e) =>
                          handleValueChange(activityIndex, inputIndex, key, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault(); 
                          }
                        }}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveKeyValue(activityIndex, inputIndex, key)
                        }
                        className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                  {editingKey.activityIndex === activityIndex &&
                    editingKey.inputIndex === inputIndex && (
                      <div className="flex items-center mt-2">
                        <input
                          type="text"
                          placeholder="Nhập cấp độ mới"
                          value={newKey}
                          onChange={(e) => setNewKey(e.target.value)}
                          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleSaveKey}
                          className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          Lưu
                        </button>
                      </div>
                    )}
                  <div className='flex justify-end'>
                  <button
                    type="button"
                    onClick={() => handleAddKeyValue(activityIndex, inputIndex)}
                    className="md:w-40 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
                  >
                    Thêm Cấp độ
                  </button>
                  </div>
                </div>
              </div>
            ))}
            <div className='flex justify-end'>
            <button
              type="button"
              onClick={() => handleAddInput(activityIndex)}
              className="md:w-40 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Thêm Hướng dẫn
            </button>
            </div>
          </div>
        ))}
        <div className="flex justify-end ">
        <button
          type="button"
          onClick={handleAddActivity}
          className="md:w-40 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 mr-4"
        >
          Thêm Hoạt Động
        </button>

        <button
        type="submit"
        className="md:w-40 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 mr-4"
      >
        Lưu Dữ Liệu
      </button>
        </div>
      </form>
      <ToastContainer />
    </div>
    </>
  );
}
