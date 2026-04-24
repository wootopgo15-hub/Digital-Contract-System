import React from 'react';
import { ContractData } from '../types';

export default function ContractPreview({data}: {data: ContractData}) {
  const highlight = (text: string, placeholder: string) => {
    if (!text) return <span className="bg-yellow-50 text-indigo-800 px-2 min-w-[3em] text-center border-b border-indigo-400 border-dashed">{placeholder}</span>;
    return <span className="font-bold border-b border-black px-1">{text}</span>;
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
          address: '충남 천안시 서북구 늘푸른 1길 20, 3층',
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-8 sm:mb-10 pt-2 sm:pt-4 tracking-tight text-black">프리랜서 강사 계약서</h1>
        
        <p className="mb-6 sm:mb-8 text-base sm:text-lg">
          장고교육개발원 {data.branch || '천안'}지사(이하 “본사”라 칭함)과 {highlight(data.instructorName, "이름")} (이하 “강사”라 칭함)는 “본사”의 프로그램에 대한 시니어 강사 계약을 다음과 같이 체결한다.
        </p>

        <div className="space-y-8 flex-1">
          <section>
            <h2 className="text-xl font-bold mb-3 text-black">제 1 조【계약의 목적】</h2>
            <p className="pl-4">
              본 계약을 통하여 “본사”와 “강사”의 역할과 권한을 명확히 함으로 양자가 신뢰속에서 목적하는 업무를 효과적으로 수행하는데 있다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">제 2 조【교육 내용】</h2>
            <p className="pl-4">
              “강사”는 “본사”가 기획, 개발, 운영하거나 외부 기관으로부터 위탁받은 일체의 교육 프로그램 “본사”가 업무상 필요에 따라 지정하는 제반 교육 서비스를 수행한다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">제 3 조【계약 조건】</h2>
            <p className="pl-4 mb-2">”강사”의 계약 조건은 다음과 같다.</p>
            <ol className="list-decimal list-outside ml-10 space-y-2">
              <li className="pl-2">계약 개시 : {highlight(data.contractStartDate, "YYYY-MM-DD")} 부터 {highlight(data.contractEndDate, "YYYY-MM-DD")} 까지 (1년 계약)</li>
              <li className="pl-2">교육 용역비 : 시간당 {highlight(data.hourlyRate, "30,000")}원 (원천징수 소득세 3.3% 전)</li>
              <li className="pl-2">용역비 지급 : 매월말 정산하여 익월 15일에 현금 지급한다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">제 4 조【부가 조건】</h2>
            <ol className="list-decimal list-outside ml-10 space-y-2">
              <li className="pl-2">상기 제3조의 교육 조건은 양자의 상호 협의하에 변경이 가능하다.</li>
              <li className="pl-2">상기의 계약 기간이 만료되면 계약은 종료되며, 교육이 추가되거나 연장될 경우, “본사”는 가능한 1개월 이전에 이를 “강사”에게 통지한다.</li>
              <li className="pl-2">“강사” 개인의 특별한 사정으로 교육을 이행하지 못하는 경우에는 교육 용역비를 지급하지 않는다.</li>
              <li className="pl-2 break-keep">“강사”가 정당한 사유 없이 교육을 이행하지 않거나 본인의 귀책사유로 인해 “본사”에 손해를 발생시킨 경우 “강사”는 이에 대한 배상 의무를 가집니다. 구체적인 사항은 “본사”와 협의하여 결정하되, 협의가 성립되지 않을 경우 “본사”의 산정 근거를 우선하여 적용한다.</li>
              <li className="pl-2 break-keep">“본사”는 상기 시간당 용역비 외에는 “강사”에게 어떠한 명목의 금액도 지급하지 않으며 “강사”도 “본사”에게 추가 금품을 요구하거나 조건을 제시하지 않는다.</li>
            </ol>
          </section>
        </div>
      </PageWrapper>

      {/* 2페이지 */}
      <PageWrapper>
        <div className="space-y-8 flex-1">
          <section>
            <h2 className="text-xl font-bold mb-3 text-black">제 5 조【”강사”의 업무】</h2>
            <p className="pl-4 mb-2">“강사”는 교육용역 제공에 있어 아래의 업무를 성실히 이행한다.</p>
            <ol className="list-decimal list-outside ml-10 space-y-2">
              <li className="pl-2">용역제공 기관의 장이 편성해준 인원을 지도한다.</li>
              <li className="pl-2">사용교구 선택은 사전에 ‘본사’ 측과 협의한다.</li>
              <li className="pl-2">교육에 사명감을 가지고 ‘본사’의 교육방침에 적극 협력하여 준다.</li>
              <li className="pl-2">교육 대상의 안전사고에 책임을 지며 교육 대상 개인의 인격을 존중하여야 한다.</li>
              <li className="pl-2">용역제공 매 시간 교육 대상의 출결사항을 파악하고, 교육 대상이 수업 중 이탈하지 않도록 지도한다.</li>
              <li className="pl-2">“강사”의 교육내용은 양자의 합의하에 결정한다.</li>
              <li className="pl-2">수업 전후 학습 기자재를 점검하고 정리하며 수업 종료 후 정리정돈과 시설유지에 만전을 기한다.</li>
              <li className="pl-2">매월 프로그램 운영 기록지를 작성하여 “본사”에게 제출한다.</li>
              <li className="pl-2 break-keep">용역제공 기관의 소속 관계자 및 입소자 가족이 교수‧학습 현장 참관을 요청하는 경우 특별한 사유가 없는 한 승인하며, 조치사항에 대하여는 반드시 따라야 한다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">제 6 조【용역세부내용】</h2>
            <ol className="list-decimal list-outside ml-10 space-y-2">
              <li className="pl-2">교육 내용 및 교육 방법, 업무 일정 등은 “본사”의 지침하에 “강사”가 자유롭게 정한다.</li>
              <li className="pl-2">“강사”는 용역제공자로서 취업규칙 등은 적용하지 않으며 본 계약서에 정해진 내용에만 구속된다.</li>
              <li className="pl-2">담당 업무는 “강사”에게 전속하며 부득이한 경우 “본사”에게 사전 통보하고 “본사”와 협의 하에 보강수업을 제공키로 한다.</li>
              <li className="pl-2">용역제공 계약의 취지에 따라 “강사”의 배분 소득은 자유직 소득으로 본다.</li>
              <li className="pl-2 break-keep">“강사”는 개인사업소득자로서 고용보험, 산재보험, 국민건강보험, 국민연금 등에 대한 가입 및 자격취득 대상이 아니므로 이의 가입 및 취득 등에 대하여 “본사”에게 어떠한 주장이나 청구를 하지 않는다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">제 7 조【강사의 책임】</h2>
            <p className="pl-4 mb-2 break-keep">
              “강사”는 계약기간이 만료되기 전까지 프로그램 운영을 스스로 포기할 수 없다. “강사”가 통보 없이 결강을 할 경우, 모든 제반문제는 “강사”가 책임진다.
            </p>
            <ol className="list-decimal list-outside ml-10 space-y-2">
              <li className="pl-2">“강사”는 퇴사를 원할 시 3개월전에 “본사”에 통보 하여야 한다.</li>
              <li className="pl-2">“강사”는 퇴사 전 다음 “강사”에게 인수인계를 철저히 하여야 한다.</li>
              <li className="pl-2">“강사”는 계약기간 만료 전 퇴사시 거래처와 계약된 교육의 교육비를 “본사”에 지급하여야 한다.</li>
              <li className="pl-2 break-keep">“강사”는 이중계약 또는 건강보험공단으로부터 어떠한 지급금을 받아서는 안되며, 이로 인한 2차 피해까지 전적으로 “강사”가 책임진다.</li>
            </ol>
          </section>
        </div>
      </PageWrapper>

      {/* 3페이지 */}
      <PageWrapper>
        <div className="space-y-8 flex-1">
          <section>
            <h2 className="text-xl font-bold mb-3 text-black">제 8 조【계약의 해지】</h2>
            <p className="pl-4 mb-2">다음과 같은 경우에는 계약기간 만료전이라 해도 “본사”는 본 계약을 해지할 수 있다.</p>
            <ol className="list-decimal list-outside ml-10 space-y-2">
              <li className="pl-2">“강사”가 법률에 의하여 공민권이 정지 또는 박탈당하는 경우</li>
              <li className="pl-2 break-keep">“강사”가 고의 또는 부주의로 중대한 사고를 발생시켜 회사의 명예와 재산상에 손해를 끼치는 경우</li>
              <li className="pl-2">“강사”가 정기 또는 수시 검진 결과 프로그램 운영에 부적격자로 판명된 경우</li>
              <li className="pl-2">“강사”가 사회적 물의를 일으키는 경우</li>
              <li className="pl-2">“강사”가 별도로 용역제공과 관계 된 자에게 이익을 취득할 경우</li>
              <li className="pl-2">“강사”가 “본사”의 기밀을 누설하여 막대한 피해를 초래한 경우</li>
              <li className="pl-2">“강사”가 폭행, 파괴, 선동 등 “본사”의 분위기를 해치는 행위를 한 경우</li>
              <li className="pl-2">“강사”가 용역제공을 태만히 하거나 능력이 부족하다고 판단된 경우</li>
              <li className="pl-2">“강사”가 위 제반 계약사항을 위반하였을 경우</li>
              <li className="pl-2">수강 인원의 부족으로 인하여 용역료를 지불하지 못할 경우</li>
              <li className="pl-2 break-keep">“강사”가 특별한 사유 없이 1개월에 3시간 이상 용역제공을 하지 못하거나 무단으로 결강 하였을 경우</li>
              <li className="pl-2 break-keep">“강사”가 용역제공을 위한 준비와 교육대상의 지도에 소홀하여 기관에서 “강사”의 교체를 원하고, 그 요구가 운영상 필요하다고 판단될 때</li>
              <li className="pl-2">입소자 가족, 입소자 사이에 불미스러운 일이 발생하여 “강사”의 교체를 원할 경우</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">제 9 조【초상권 사용동의】</h2>
            <p className="pl-4 break-keep">
              “강사”는 강의 중 또는 콘텐츠 제작을 위해 “본사”에 의해 촬영된 초상권 저작물을 “본사”의 프로그램 제품으로 사용하며 외부 교육, 업체 홍보 등의 목적으로 사용하는데 동의 한다. 사용형태는 동영상 콘텐츠, 교재, 간행물, 단행물, 홍보용 매체 등 모든 형태를 포함하며, 사용 용도는 교육, 강의, 홍보 등 “본사”가 진행하는 모든 종류의 활동을 포함한다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">제 10 조【비밀유지의무】</h2>
            <p className="pl-4 break-keep">
              “강사”는 계약 기간은 물론 계약 해지 후에도 용역제공과 관련된 일체의 내용에 대하여 비밀유지의무를 지며 그러하지 않은 경우 “본사”는 “강사”에게 민·형사상 손해배상을 청구 할 수 있다.
            </p>
          </section>
        </div>
      </PageWrapper>

      {/* 4페이지 */}
      <PageWrapper>
        <div className="space-y-8 flex-1 flex flex-col justify-between">
          <div>
            <section>
              <h2 className="text-xl font-bold mb-3 text-black">제 11 조【기타사항】</h2>
              <p className="pl-4 break-keep">
                상기의 내용으로 “본사”와 “강사”는 상호 자유로운 의사로 원만히 계약을 체결하였으므로 신의에 입각하여 성실히 계약 내용을 준수한다. 그리고 “강사”의 계약관계의 특수성을 감안하여 어떠한 이유로도 “강사”는 근로기준법상의 근로자로 해석되어지지 아니하며 아울러 “본사”에게 노동법상의 일체의 청구 (퇴직금, 연차수당, 특근수당 등) 행위나 민·형사상의 이의 제기를 하지 아니 한다.
              </p>
            </section>

            <p className="mt-12 mb-12 text-center text-lg leading-relaxed font-medium break-keep px-4 pt-10">
              위와 같이 본 계약이 유효하게 성립하였음을 양자는 증명하면서 본 계약서 2통을 작성하여 각각 서명(또는 기명) 날인한 후 “본사”와 “강사”가 각각 1통씩을 보관한다.
            </p>

            <div className="text-center mb-24 font-bold text-2xl tracking-widest text-black pt-6">
              20{highlight(data.contractYear, "YY")}년 {highlight(data.contractMonth, "MM")}월 {highlight(data.contractDay, "DD")}일
            </div>
          </div>

          {/* 서명 영역 */}
          <div className="flex flex-col md:flex-row justify-between items-start w-full gap-12 sm:gap-16 md:gap-4 text-base sm:text-lg pb-10">
            {/* 본사 */}
            <div className="w-full md:w-1/2 md:pr-4 md:border-r-2 border-gray-100 min-h-[160px]">
              <h3 className="font-bold text-2xl mb-6 text-black tracking-widest text-center">“본   사”</h3>
              <div className="space-y-4 relative px-2">
                <div className="flex"><span className="w-24 shrink-0 font-bold text-black">상 호 :</span> 장고교육개발원 {data.branch || '천안'}지사</div>
                <div className="flex"><span className="w-24 shrink-0 font-bold text-black">주 소 :</span> <span className="flex-1 break-keep">{branchInfo.address}</span></div>
                <div className="flex"><span className="w-24 shrink-0 font-bold text-black">연 락 처 :</span> <span>{branchInfo.contact}</span></div>
                <div className="flex items-center z-10 relative">
                  <span className="w-24 shrink-0 font-bold text-black">대 표 자 :</span> 
                  <span>{branchInfo.representative.split('').join(' ')}</span>
                  <div className="ml-4 relative flex items-center justify-center">
                    <span>(인)</span>
                    {data.companyStamp && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-[20%] -translate-y-1/2 opacity-90 w-[80px] h-[80px] pointer-events-none flex items-center justify-center">
                        <img src={data.companyStamp} alt="본사 도장" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 강사 */}
            <div className="w-full md:w-1/2 md:pl-8 min-h-[160px]">
               <h3 className="font-bold text-2xl mb-6 text-black tracking-widest text-center">“강   사”</h3>
               <div className="space-y-4 relative px-2">
                 <div className="flex items-center z-10 relative">
                   <span className="w-32 shrink-0 font-bold text-black">이 름 :</span> 
                   {highlight(data.instructorName, "이름")}
                   <div className="ml-4 relative flex items-center justify-center">
                     <span>(인)</span>
                     {data.instructorSignature && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-[20%] -translate-y-1/2 w-[100px] h-[70px] pointer-events-none flex items-center justify-center">
                        <img src={data.instructorSignature} alt="강사 서명" className="w-full h-full object-contain" />
                      </div>
                    )}
                   </div>
                 </div>
                 <div className="flex pt-2"><span className="w-32 shrink-0 font-bold text-black">주 소 :</span> <span className="flex-1 break-keep">{highlight(data.instructorAddress, "주소정보입력")}</span></div>
                 <div className="flex pt-2"><span className="w-32 shrink-0 font-bold text-black">연 락 처 :</span> {highlight(data.instructorContact, "010-0000-0000")}</div>
                 <div className="flex pt-2"><span className="w-32 shrink-0 font-bold text-black">주민등록번호 :</span> {highlight(data.instructorRrn, "YYMMDD-XXXXXXX")}</div>
               </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
