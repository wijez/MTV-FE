import React, { useState, useEffect } from 'react';
import { getListScientificActivities } from '../../api/api';

const ResearchQuestions = ({ onSelect }) => {
  const [activities, setActivities] = useState([]);
  const [level1Options, setLevel1Options] = useState([]);
  const [level2Options, setLevel2Options] = useState([]);
  const [level3Options, setLevel3Options] = useState([]);

  const [selectedLevel1, setSelectedLevel1] = useState('');
  const [selectedLevel2, setSelectedLevel2] = useState('');
  const [selectedLevel3, setSelectedLevel3] = useState('');

  // Lưu lại input đang chọn để show note & proof
  const [selectedInput, setSelectedInput] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const acts = await getListScientificActivities();
        setActivities(acts);
        setLevel1Options([...new Set(acts.map(act => act.group))]);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    };
    fetchData();
  }, []);

  // Khi chọn group (level 1)
  const handleLevel1Change = (e) => {
    const group = e.target.value;
    setSelectedLevel1(group);
    setSelectedLevel2('');
    setSelectedLevel3('');
    setSelectedInput(null);
    const filtered = activities.filter(act => act.group === group);
    setLevel2Options([...new Set(filtered.map(act => act.content))]);
    setLevel3Options([]);
  };

  // Khi chọn content (level 2)
  const handleLevel2Change = (e) => {
    const content = e.target.value;
    setSelectedLevel2(content);
    setSelectedLevel3('');
    setSelectedInput(null);

    // Tìm activity theo group + content
    const activity = activities.find(act => act.group === selectedLevel1 && act.content === content);
    if (activity && Array.isArray(activity.input)) {
      // Gom tất cả value key từ các input
      let valueOptions = [];
      activity.input.forEach((inp, idx) => {
        Object.keys(inp.value || {}).forEach(key => {
          valueOptions.push({
            key,
            inputIdx: idx,
          });
        });
      });
      setLevel3Options(valueOptions);
    } else {
      setLevel3Options([]);
    }
  };

  // Khi chọn value (level 3)
  const handleLevel3Change = (e) => {
    const idx = e.target.selectedIndex - 1; // -1 vì option đầu là placeholder
    const valueKey = e.target.value;
    setSelectedLevel3(valueKey);

    // Tìm activity và input chứa value này
    const activity = activities.find(act => act.group === selectedLevel1 && act.content === selectedLevel2);
    if (activity && Array.isArray(activity.input)) {
      let foundInput = null;
      let foundValue = null;
      for (let inp of activity.input) {
        if (inp.value && Object.keys(inp.value).includes(valueKey)) {
          foundInput = inp;
          foundValue = inp.value[valueKey];
          break;
        }
      }
      setSelectedInput(foundInput);

      // Trả về dữ liệu cho parent
      onSelect && onSelect({
        activityId: activity.id,
        group: selectedLevel1,
        content: selectedLevel2,
        valueKey,
        value: foundValue,
        note: foundInput?.note || '',
        proof: foundInput?.proof || '',
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chọn Hoạt Động Nghiên cứu khoa học</h2>

      {/* Level 1: Group */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Nhóm</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedLevel1}
          onChange={handleLevel1Change}
        >
          <option value="">-- Chọn Nhóm --</option>
          {level1Options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Level 2: Content */}
      {level2Options.length > 0 && (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Nội dung</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedLevel2}
            onChange={handleLevel2Change}
          >
            <option value="">-- Chọn Nội dung --</option>
            {level2Options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      )}

      {/* Level 3: Value */}
      {level3Options.length > 0 && (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Giải thưởng & Giá trị</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedLevel3}
            onChange={handleLevel3Change}
          >
            <option value="">-- Chọn Giải thưởng --</option>
            {level3Options.map((opt, idx) => (
              <option key={opt.key + '-' + idx} value={opt.key}>
                {opt.key} {/* Không hiển thị giá trị ở đây, chỉ key */}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Hiển thị note và proof */}
      {selectedInput && (
        <div className="mb-4 p-3 bg-gray-50 rounded border">
          <div><b>Ghi chú:</b> {selectedInput.note || <span className="text-gray-400">Không có</span>}</div>
          <div><b>Minh chứng:</b> {selectedInput.proof || <span className="text-gray-400">Không có</span>}</div>
        </div>
      )}
    </div>
  );
};

export default ResearchQuestions;