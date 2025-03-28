import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import { Link, useNavigate, useParams } from 'react-router-dom'
import swal from 'sweetalert'
import axios from 'axios'

import { isAutheticated } from 'src/auth'


const EditLanguage = () => {
    const id = useParams()?.id
    const token = isAutheticated();
    const navigate = useNavigate()
    const [data, setData] = useState({
        language: '',

    })
    const [loading, setLoading] = useState(false)


    const getCategory = () => {
        axios
            .get(`/api/language/${id}`, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setData((prev) => ({
                    ...prev,
                    ...res.data?.data,
                }))

            })
            .catch((err) => { })

    }

    useEffect(() => {
        getCategory()
    }, [])

    const handleChange = (e) => {

        setData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleSubmit = () => {
        if (data.language.trim() === '') {
            swal({
                title: 'Warning',
                text: 'Fill all mandatory fields',
                icon: 'error',
                button: 'Close',
                dangerMode: true,
            })
            return
        }
        setLoading(true)
        axios
            .patch(`/api/Language/${id}`, data, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                swal({
                    title: 'Updated',
                    text: 'Language updated successfully!',
                    icon: 'success',
                    button: 'Close',
                })
                setLoading(false)
                navigate('/languages', { replace: true })
            })
            .catch((err) => {
                setLoading(false)
                swal({
                    title: 'Warning',
                    text: 'Something went wrong!',
                    icon: 'error',
                    button: 'Retry',
                    dangerMode: true,
                })
            })
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div
                        className="
                    page-title-box
                    d-flex
                    align-items-center
                    justify-content-between
                  "
                    >
                        <div style={{ fontSize: '22px' }} className="fw-bold">
                            Edit Language
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <h4 className="mb-0"></h4>
                        </div>

                        <div className="page-title-right">
                            <Button
                                variant="contained"
                                color="primary"
                                style={{
                                    fontWeight: 'bold',
                                    marginBottom: '1rem',
                                    textTransform: 'capitalize',
                                    marginRight: '5px',
                                }}
                                onClick={() => handleSubmit()}
                                disabled={loading}
                            >
                                {loading ? 'Loading' : 'Update'}
                            </Button>
                            <Link to="/cities">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: '1rem',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-8 mx-auto">
                    <div className="card h-100">
                        <div className="card-body px-5">
                            <div className="mb-3">
                                <label htmlFor="language" className="form-label">
                                    Language *
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="language"

                                    value={data.language}
                                    maxLength='50'
                                    onChange={(e) => handleChange(e)}
                                />
                                {data.language && <p className="pt-1 pl-2 text-secondary">
                                    Remaining characters : {50 - data.language.length}
                                </p>}
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditLanguage
