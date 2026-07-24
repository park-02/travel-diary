import { useEffect, useState } from "react";
import "./TravelForm.css";

export default function TravelForm({ onAdd, editingTravel, onUpdate, onCancelEdit }) {
    const [form, setForm] = useState({
        name: '',
        country: '',
        city: '',
        date: '',
        image: '',
        rating: 5,
        memo: ''
    })

    const [errors, setErrors] = useState({})    // 에러 메시지 state

    useEffect(() => {
        if (editingTravel) {
            // 폼 데이터
            setForm({
                name: editingTravel.name,
                country: editingTravel.country,
                city: editingTravel.city,
                date: editingTravel.date,
                image: editingTravel.image,
                rating: editingTravel.rating,
                memo: editingTravel.memo,
            })
        } else {
            // 폼 초기화
            setForm({
                name: '',
                country: '',
                city: '',
                date: '',
                image: '',
                rating: 5,
                memo: '',
            })
        }
    }, [editingTravel])

    // handleChange 함수 : input 처
    // input 태그에 name 속성 지정 
    // e.target.name으로 필드 구분, e.target.value로 입력된 값 가져오고
    // rating 필드 Number()로 변환
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev, // 기존 필드 값 그대로 유지
            [name]: name === 'rating' ? Number(value) : value,
        }))
        // 사용자가 다시 입력하면 에러메시지 삭제
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!form.name.trim()) {
            newErrors.name = '여행 이름을 입력해주세요.'
        }
        if (!form.country.trim()) {
            newErrors.country = '국가를 입력해주세요.'
        }
        if (!form.city.trim()) {
            newErrors.city = '도시를 입력해주세요.'
        }
        if (!form.date) {
            newErrors.date = '날짜를 선택해주세요.'
        }
        if (form.rating < 1 || form.rating > 5) {
            newErrors.rating = '평점은 1~5 사이여야 해요.'
        }

        setErrors(newErrors)

        // newErrors 객체에 에러 없으면 유효성 통과
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault() // 새로고침 방지

        if (!validate()) {
            return; // 유효성 검사 실패하면 여기서 중단
        }

        if (editingTravel) {
            // 수정 모드: 기존 id를 유지한 채 업데이트된 데이터를 넘김
            onUpdateTravel({
                ...editingTravel,
                ...form,
            });
        } else {
            // 새 id를 생성해서 넘김 
            onAddTravel({
                id: Date.now(),
                ...form,
            })
        }


        // 폼 초기화
        setForm({ name: '', country: '', city: '', date: '', image: '', rating: 5, memo: '' })
        setErrors({})
    }

    // 취소 버튼
    const handleCancel = () => {
        setForm({ name: '', country: '', city: '', date: '', image: '', rating: 5, memo: '' });
        setErrors({});
        if (onCancelEdit) onCancelEdit();
    }

    return (
        <form className="travel-form" onSubmit={handleSubmit}>
            <h2>{editingTravel ? '여행지 수정' : '새 여행지 추가'}</h2>
            <div className="form-row">
                <div className="form-group">
                    <label>여행지 이름 *</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
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
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="form-group">
                <label>사진 URL</label>
                <input
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://i.namu.wiki/i/lClVZJsn6bthAnbZXTTqmH_FI-q_Q0-KO6juNNa7l5jkz01sHORr09SXASvzwrJ_CL1MRS3qnpARuMJgbJx_SXwk_bSbGjRvzGvZ9Nz0xmnOsC_tT36uN2VyUes8rv9_R8DhD6fLduB3Ee2Mp7dOYg.webp"
                />
            </div>
            <div className="form-group">
                <label>평점: {form.rating}점</label>
                <input
                    type="range"
                    name="rating"
                    min="1"
                    max="5"
                    value={form.rating}
                    onChange={handleChange}
                />
            </div>
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
            <div className="form-buttons">
                <button type="submit" className="btn-primary">
                    {editingTravel ? '수정하기' : '추가하기'}
                </button>
                {editingTravel && (
                    <button type="button" className="btn-secondary" onClick={handleCancel}>
                        취소
                    </button>
                )}
            </div>
        </form >
    )

}




