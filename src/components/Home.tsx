import React from 'react';
import { FileSignature, Building2, Network, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

interface Props {
  onSelect: (type: 'instructor' | 'company' | 'branch') => void;
}

export default function Home({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-200/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-blue-200/30 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-6 md:px-12 md:py-8 flex items-center justify-between relative z-10 w-full max-w-7xl mx-auto">
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
             <ShieldCheck className="w-6 h-6 text-white" />
           </div>
           <span className="text-xl font-extrabold text-gray-900 tracking-tight">장고교육개발원</span>
         </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-6xl mx-auto pb-20">
        <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold text-xs mb-4 uppercase tracking-widest shadow-sm">
            E-Contract Solution
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight break-keep">
            빠르고 안전한 <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">전자 계약 시스템</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 break-keep leading-relaxed">
            복잡한 서면 계약을 대신할 스마트한 양식을 선택해주세요. <br className="hidden sm:block" />
            장고교육개발원의 맞춤형 계약 서비스입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4 sm:px-0 max-w-5xl">
          {/* 강사 계약서 */}
          <button
            onClick={() => onSelect('instructor')}
            className="group relative bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-indigo-100 text-left flex flex-col min-h-[300px] h-[320px] overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/60 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-[2]" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 transform group-hover:scale-105">
                <FileSignature className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">프리랜서 강사 계약서</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-auto break-keep">
                개인 강사와의 시니어 강사 용역 및 교육 진행을 위한 표준 전자 계약서입니다.
              </p>
              <div className="mt-8 flex items-center text-indigo-600 font-bold text-sm tracking-wide">
                작성 시작하기 <ArrowRight className="w-4 h-4 ml-1 translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
          </button>

          {/* 업체 계약서 */}
          <button
            onClick={() => onSelect('company')}
            className="group relative bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-indigo-100 text-left flex flex-col min-h-[300px] h-[320px] overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/60 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-[2]" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 transform group-hover:scale-105">
                <Building2 className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">업체 계약서</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-auto break-keep">
                외부 기관 및 센터와의 프로그램 위탁 교육을 위한 계약서 양식입니다.
              </p>
              <div className="mt-8 flex items-center text-blue-600 font-bold text-sm tracking-wide">
                작성 시작하기 <ArrowRight className="w-4 h-4 ml-1 translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
          </button>

          {/* 지사 계약서 (준비중) */}
          <div className="relative bg-white/60 backdrop-blur-sm rounded-[2rem] p-8 border border-gray-200/60 text-left flex flex-col min-h-[300px] h-[320px] overflow-hidden cursor-not-allowed group shadow-sm">
            <div className="absolute inset-0 bg-gray-50/50 z-0"></div>
            <div className="absolute top-8 right-8 bg-gray-200/80 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 z-20 backdrop-blur-md shadow-sm">
              <Clock className="w-3.5 h-3.5" /> 준비중
            </div>
            <div className="relative z-10 flex flex-col h-full opacity-50">
              <div className="w-14 h-14 bg-gray-100/80 rounded-2xl flex items-center justify-center mb-6 text-gray-400">
                <Network className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">지사 계약서</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-auto break-keep">
                지역 본부 및 지사 설립, 운영 권한 위임 및 상호 협력을 위한 계약서입니다.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
