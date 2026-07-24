import { useEffect, useState } from "react";

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

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }


}