import React from 'react';
import { CompanyContractData } from '../types';

export default function CompanyContractPreview({ data }: { data: CompanyContractData }) {
  const highlight = (text: string, placeholder: string) => {
    if (!text) return <span className="text-blue-500 bg-blue-50 border-b border-blue-200 px-1 font-semibold">{placeholder}</span>;
    return <span className="font-bold border-b border-gray-800 px-1 text-black bg-yellow-100/50">{text}</span>;
  };

  const formatTimeWindow = (timeStr: string) => {
    if (!timeStr) return "";
    if (timeStr.includes('~')) return timeStr;
    const [hours, minutes] = timeStr.split(':');
    if (hours && minutes) {
      const h = parseInt(hours, 10);
      const endHour = String((h + 1) % 24).padStart(2, '0');
      return `${timeStr}~${endHour}:${minutes}`;
    }
    return timeStr;
  };

  const PageWrapper = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`pdf-page relative overflow-hidden bg-white shadow-lg sm:shadow-xl rounded-lg p-10 sm:p-14 mx-auto mb-8 print-page text-justify leading-loose sm:leading-relaxed text-gray-800 break-keep flex flex-col ${className}`} style={{maxWidth: '850px', width: '100%', wordBreak: 'keep-all', minHeight: '1120px'} as any}>
      {/* 워터마크 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <span className="text-[300px] font-black text-blue-500/10 transform rotate-[-45deg] tracking-widest leading-none">JG</span>
      </div>
      {/* 내용 콘텐츠 */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );

  const getBranchInfo = (branch: string) => {
    switch (branch) {
      case '세종':
        return {
          address: '세종특별자치시 호려울로 29 702호',
          representative: '민동환',
          contact: '010-6636-4667'
        };
      case '평택':
        return {
          address: '경기 평택시 조개터로 25 16-2 한미아파트 상가동 2층',
          representative: '박소연',
          contact: '010-8616-9952'
        };
      case '천안':
      case '예산':
      default:
        return {
          address: '충남 천안시 서북구 늘푸른1길 20, 3층',
          representative: '최유정',
          contact: '010-8971-4304'
        };
    }
  };

  const branchInfo = getBranchInfo(data.branch);

  return (
    <div className="pdf-container">
      {/* 1페이지 */}
      <PageWrapper>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-8 sm:mb-10 pt-2 sm:pt-4 tracking-tight text-black">장고교육개발원 프로그램 위탁계약서</h1>
        
        <p className="mb-8 text-base sm:text-lg">
          {highlight(data.centerName, "센터명/요양원")} (이하 “갑”이라 한다) 과 장고교육개발원 {data.branch || '천안'}지사(이하 “을”이라 한다)는 아래와 같이 프로그램 교육에 대한 위탁계약을 체결한다.
        </p>

        <div className="space-y-6 sm:space-y-8 text-base sm:text-lg flex-1">
          <section>
            <h2 className="text-xl font-bold mb-3 text-black">제 1 조【프로그램 내용】</h2>
            <p className="pl-4 break-keep mb-3">
              “을”은 “갑”이 위탁한 프로그램 교육을 다음과 같이 성실히 수행한다.
            </p>
            <div className="pl-4 space-y-2">
              <p className="font-medium">1. 프로그램 세부 내용은 다음과 같다.</p>
              <div className="pl-4 space-y-1">
                <p>1) 과정명 : 장고교육 프로그램</p>
                <p>2) 기 간 : {highlight(data.contractStartDate, "YYYY-MM-DD")} 부터 {highlight(data.contractEndDate, "YYYY-MM-DD")} 까지 (1년 계약 자동연장)</p>
                <p>3) 시 간 :</p>
                <div className="pl-6 flex flex-col gap-1 my-1">
                  {[1, 2, 3, 4, 5].map(idx => {
                    const hasData = data[`subject${idx}` as keyof CompanyContractData] || 
                                    data[`day${idx}` as keyof CompanyContractData] || 
                                    data[`time${idx}` as keyof CompanyContractData];
                    // 첫 줄은 항상 렌더링하고, 2~5번째 줄은 데이터가 있을 때만 렌더링
                    if (idx > 1 && !hasData) return null;
                    return (
                      <p key={idx}>
                        장고교육 {highlight(data[`subject${idx}` as keyof CompanyContractData] as string, "과목")} 매 주 {highlight(data[`day${idx}` as keyof CompanyContractData] as string, "요일")} {highlight(formatTimeWindow(data[`time${idx}` as keyof CompanyContractData] as string), "시간")} (60분간)
                      </p>
                    );
                  })}
                </div>
                <p>4) 일 정 : 주 1회 각 1시간</p>
              </div>
              <p className="pt-2">2. “을”은 “갑”의 요구에 따른 운영안 설계 및 월 계획안에 대해 협력한다.</p>
              <p className="break-keep">3. 상기 프로그램 교육 운영을 위해 적정 자격증을 갖춘 강사를 파견하여 교육을 수행 한다.</p>
              <p className="break-keep">4. 교육비는 “갑”이 공단에서 청구하여 수령하게 되는 가산금을 기준으로 정하며, “갑”이 “을”에게 지급하는 교육비는 1 시간 {highlight(data.hourlyRate, "금액")} 원 이다.</p>
              <p className="break-keep">5. “갑”은 상기의 가산금을 공단으로 수령하는 즉시 “을”에게 아래의 계좌로 지급한다.</p>
              <div className="pl-4 space-y-1">
                <p>- 매 월 {highlight(data.paymentDay, "일")}일</p>
                {data.bankAccount1 && <p>- {data.bankAccount1}</p>}
                {data.bankAccount2 && <p>- {data.bankAccount2}</p>}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">제 2 조【성실의무】</h2>
            <p className="pl-4 break-keep">
              1. “갑”과 “을”은 본 계약서에 의거 프로그램 교육의 능률적인 진행과 학습목표가 이루어 질 수 있도록 상호 협력하여 제반 사항을 성실히 이행하여야 한다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">제 3 조【비밀유지】</h2>
            <p className="pl-4 break-keep">
              1. “갑”과 “을”은 본 계약을 이행함에 있어 상대방의 비밀을 제3자에게 누설하거나 다른 목적에 사용하여서는 안된다.
            </p>
          </section>
        </div>
      </PageWrapper>

      {/* 2페이지 */}
      <PageWrapper>
        <div className="space-y-6 sm:space-y-8 text-base sm:text-lg flex-1 flex flex-col justify-between">
          <div>
            <section>
              <h2 className="text-xl font-bold mb-3 text-black">제 4 조【해석 및 합의】</h2>
              <p className="pl-4 break-keep">
                1. 본 계약서 상의 조문해석과 관련하여 쌍방간의 이견이 있을 경우에는 상호 협의하여 결정하며, 본 계약서 상에 명시되지 아니한 사항은 쌍방이 협의한 바로 따른다.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-bold mb-3 text-black">제 5 조【계약기간 및 자동연장】</h2>
              <p className="pl-4 break-keep">
                1. 본 계약은 체결일로부터 1년간 유효하며, 계약기간 만료 후 별도의 해지 의사표시가 없는 경우 자동 연장된다.
              </p>
            </section>

            <p className="mt-12 mb-12 text-center text-lg leading-relaxed font-medium break-keep px-4 pt-4">
              *이 계약의 성립을 증명하기 위하여 계약서 2통을 작성하여 쌍방이 기명 날인 한 후 각각 1통씩 보관한다.
            </p>

            <div className="text-center mb-24 font-bold text-2xl tracking-widest text-black pt-4">
              계약 일자 : 20{highlight(data.contractYear, "YY")}년 {highlight(data.contractMonth, "MM")}월 {highlight(data.contractDay, "DD")}일
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start w-full gap-12 sm:gap-16 md:gap-4 text-base sm:text-lg pb-10">
            {/* 갑: 기관 (Client) */}
            <div className="w-full md:w-1/2 md:pr-4 md:border-r-2 border-gray-100 min-h-[160px]">
               <h3 className="font-bold text-2xl mb-6 text-black tracking-widest text-center">“갑”</h3>
               <div className="space-y-4 relative px-2">
                 <div className="flex pt-2"><span className="w-28 shrink-0 font-bold text-black">사업자번호 :</span> <span className="flex-1 break-keep">{highlight(data.companyBusinessNumber, "000-00-00000")}</span></div>
                 <div className="flex pt-2"><span className="w-28 shrink-0 font-bold text-black">주 소 :</span> <span className="flex-1 break-keep">{highlight(data.companyAddress, "상세주소")}</span></div>
                 <div className="flex items-center z-10 relative pt-2">
                   <span className="w-28 shrink-0 font-bold text-black">대 표 :</span> 
                   {highlight(data.companyRepresentative, "대표자명")}
                   <div className="ml-4 relative flex items-center justify-center">
                     <span>(인)</span>
                     {data.companySignature && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-[20%] -translate-[45%] w-[100px] h-[70px] pointer-events-none flex items-center justify-center">
                        <img src={data.companySignature} alt="기관 서명" className="w-full h-full object-contain" />
                      </div>
                    )}
                   </div>
                 </div>
                 <div className="flex pt-2"><span className="w-28 shrink-0 font-bold text-black">연 락 처 :</span> <span className="flex-1 break-keep">{highlight(data.companyContact, "연락처")}</span></div>
                 <div className="flex pt-2"><span className="w-28 shrink-0 font-bold text-black">이메일 :</span> <span className="flex-1 break-keep">{highlight(data.companyEmail, "이메일")}</span></div>
               </div>
            </div>

            {/* 을: 장고교육개발원 (Janggo) */}
            <div className="w-full md:w-1/2 md:pl-8 min-h-[160px]">
              <h3 className="font-bold text-2xl mb-6 text-black tracking-widest text-center">“을”</h3>
              <div className="space-y-4 relative px-2">
                <div className="flex"><span className="w-28 shrink-0 font-bold text-black">상 호 :</span> 장고교육개발원 {data.branch || '천안'}지사</div>
                <div className="flex"><span className="w-28 shrink-0 font-bold text-black">사업자번호 :</span> 544 - 97 - 01493</div>
                <div className="flex"><span className="w-28 shrink-0 font-bold text-black">주 소 :</span> <span className="flex-1 break-keep">{branchInfo.address}</span></div>
                <div className="flex items-center z-10 relative">
                  <span className="w-28 shrink-0 font-bold text-black">대 표 :</span> 
                  <span>{branchInfo.representative.split('').join(' ')}</span>
                  <div className="ml-4 relative flex items-center justify-center">
                    <span>(인)</span>
                    {data.janggoStamp && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-[20%] -translate-y-1/2 opacity-90 w-[80px] h-[80px] pointer-events-none flex items-center justify-center">
                        <img src={data.janggoStamp} alt="장고교육 도장" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex"><span className="w-28 shrink-0 font-bold text-black">연 락 처 :</span> <span>{branchInfo.contact}</span></div>
                <div className="flex"><span className="w-28 shrink-0 font-bold text-black">이 메 일 :</span> janggo1983@naver.com</div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
