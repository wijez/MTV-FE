import React from 'react'
import ProposeButton from '../Button/buttonPropose'
import { Coins, BookPlus, LaptopMinimalCheck, ChartNoAxesCombined } from 'lucide-react';

export default function Propose() {
  return (
    <>
       <div className="flex flex-col items-center justify-center p-4 rounded-lg w-full h-full mx-auto md:p-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <ProposeButton Icon={Coins} label="Đề xuất kinh phí" />
        <ProposeButton Icon={BookPlus} label="Tạo NCKH"/>
        <ProposeButton Icon={LaptopMinimalCheck} label="Nghiên cứu đã hoàn thành"/>
        <ProposeButton Icon={ChartNoAxesCombined} label="Báo cáo chi tiết"/>
        </div>
    </div>
    </>
  )
}
