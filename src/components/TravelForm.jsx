import { useEffect, useState } from "react";
import "./TravelForm.css"; // TravelForm 전용 스타일시트 불러오기

// props 설명
// - onAdd: 새 여행지를 추가할 때 호출하는 함수 (부모인 App에서 내려줌)
// - editingTravel: 현재 수정 중인 여행지 객체. null/undefined면 "추가 모드", 값이 있으면 "수정 모드"
// - onUpdate: 기존 여행지를 수정할 때 호출하는 함수
// - onCancelEdit: 수정 모드를 취소하고 다시 추가 모드로 돌아갈 때 호출하는 함수
function TravelForm({ onAdd, editingTravel, onUpdate, onCancelEdit }) {

    // -----------------------------------------------------------
    // 여러 개의 input 값을 "하나의 객체(form)"로 묶어서 관리
    // -> input마다 useState를 따로 쓰지 않고, 필드별로 form.xxx 형태로 접근
    // -----------------------------------------------------------
    const [form, setForm] = useState({
        name: '',       // 여행지 이름
        country: '',    // 국가
        city: '',       // 도시
        date: '',       // 방문 날짜
        image: '',      // 사진 URL
        rating: 5,      // 평점 (1~5, 기본값 5)
        memo: ''        // 메모
    });

    // -----------------------------------------------------------
    // 수정 모드 감지용 useEffect
    // editingTravel이 바뀔 때마다(= 사용자가 목록에서 다른 항목의 "수정" 버튼을 누를 때마다) 실행됨
    // editingTravel 값이 있으면 그 데이터를 그대로 form state에 넣어서
    // input들에 기존 값이 채워지도록 만든다.
    // ⚠️ 주의: 여기서는 editingTravel이 없을 때(추가 모드로 돌아갈 때) 폼을 초기화하는 로직이 없음
    //    -> 수정 취소 시 폼 초기화는 handleCancel에서 별도로 처리하고 있음
    // -----------------------------------------------------------
    useEffect(() => {
        if (editingTravel) {
            setForm(editingTravel); // 수정 모드: 폼에 기존 데이터 채우기
        }
    }, [editingTravel]);

    // -----------------------------------------------------------
    // 모든 input에서 공통으로 사용하는 change 핸들러
    // - e.target.name: 어떤 input인지 (input 태그의 name 속성과 매칭됨)
    // - e.target.value: 사용자가 입력한 값
    // - [name]: value 형태(computed property name)로 form 객체 중 해당 필드만 갱신
    //   나머지 필드는 ...form으로 그대로 유지
    // -----------------------------------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // -----------------------------------------------------------
    // 폼 제출(submit) 처리 함수
    // -----------------------------------------------------------
    const handleSubmit = (e) => {
        e.preventDefault(); // 폼 제출 시 브라우저가 기본으로 하는 페이지 새로고침을 막음 (핵심 포인트!)

        // 간단한 필수값 검사: 하나라도 비어있으면 alert 띄우고 제출 중단
        if (!form.name || !form.country || !form.city || !form.date) {
            alert('필수 항목을 모두 입력해주세요!');
            return;
        }

        if (editingTravel) {
            // 수정 모드: 폼 데이터에 기존 id를 다시 붙여서 onUpdate 호출
            // (form 자체에는 id가 없을 수 있으므로 editingTravel.id로 명시적으로 채워줌)
            onUpdate({ ...form, id: editingTravel.id });
        } else {
            // 추가 모드: 새 id와 생성 시각을 붙여서 onAdd 호출
            const newTravel = {
                ...form,
                id: Date.now(),                       // 고유 id로 현재 타임스탬프 사용 (간단한 방식)
                createdAt: new Date().toISOString()   // 생성된 시각 기록 (ISO 문자열 형태)
            };
            onAdd(newTravel);
        }

        // 제출 완료 후 폼을 다시 빈 상태로 초기화 (추가 모드든 수정 모드든 공통)
        setForm({
            name: '',
            country: '',
            city: '',
            date: '',
            image: '',
            rating: 5,
            memo: ''
        });
    };

    // -----------------------------------------------------------
    // 수정 모드에서 "취소" 버튼을 눌렀을 때
    // - 폼을 초기 상태로 되돌리고
    // - 부모(App)에게 "수정 모드 그만할게"라고 알려줌 (onCancelEdit 호출)
    //   -> App에서 editingTravel을 null로 바꿔주는 로직과 연결되어 있어야 함
    // -----------------------------------------------------------
    const handleCancel = () => {
        setForm({
            name: '',
            country: '',
            city: '',
            date: '',
            image: '',
            rating: 5,
            memo: ''
        });
        onCancelEdit();
    };

    return (
        <form className="travel-form" onSubmit={handleSubmit}>
            {/* editingTravel 유무에 따라 제목이 "수정" / "추가"로 바뀜 */}
            <h2>{editingTravel ? '여행지 수정' : '새 여행지 추가'}</h2>

            {/* 이름 / 국가 - 한 줄에 나란히 배치 */}
            <div className="form-row">
                <div className="form-group">
                    <label>여행지 이름 *</label>
                    <input
                        type="text"
                        name="name"           // handleChange에서 이 name으로 필드 구분
                        value={form.name}     // form state와 연결된 controlled input
                        onChange={handleChange}
                        placeholder="예: 에펠탑"
                    />
                </div>
                <div className="form-group">
                    <label>국가 *</label>
                    <input
                        type="text"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        placeholder="예: 프랑스"
                    />
                </div>
            </div>

            {/* 도시 / 방문 날짜 - 한 줄에 나란히 배치 */}
            <div className="form-row">
                <div className="form-group">
                    <label>도시 *</label>
                    <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="예: 파리"
                    />
                </div>
                <div className="form-group">
                    <label>방문 날짜 *</label>
                    <input
                        type="date"          // 날짜 선택 전용 input (브라우저 기본 달력 UI 제공)
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* 사진 URL 입력 (선택 항목) */}
            <div className="form-group">
                <label>사진 URL</label>
                <input
                    type="url"              // URL 형식 힌트를 브라우저에 제공 (모바일 키보드 등에 영향)
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            {/* 평점 - range 슬라이더 (1~5) */}
            <div className="form-group">
                <label>평점: {form.rating}점</label> {/* 현재 값 실시간으로 표시 */}
                <input
                    type="range"
                    name="rating"
                    min="1"
                    max="5"
                    value={form.rating}
                    onChange={handleChange}
                // ⚠️ range input의 value는 문자열로 들어오므로
                //    form.rating이 실제로는 "3" 같은 문자열일 수 있음
                //    -> 나중에 별점 비교/정렬 등에 쓸 거면 handleChange에서 Number() 변환 고려 필요
                />
            </div>

            {/* 메모 (선택 항목) */}
            <div className="form-group">
                <label>메모</label>
                <textarea
                    name="memo"
                    value={form.memo}
                    onChange={handleChange}
                    rows="4"
                    placeholder="여행지에 대한 메모를 작성하세요..."
                />
            </div>

            {/* 제출 / 취소 버튼 영역 */}
            <div className="form-buttons">
                <button type="submit" className="btn-primary">
                    {editingTravel ? '수정하기' : '추가하기'}
                </button>

                {/* 수정 모드일 때만 취소 버튼 노출 */}
                {editingTravel && (
                    <button type="button" className="btn-secondary" onClick={handleCancel}>
                        취소
                    </button>
                )}
            </div>
        </form>
    );
}

export default TravelForm;