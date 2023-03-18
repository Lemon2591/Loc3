import React, { useEffect, useState } from 'react'
import { AiOutlineDelete } from "react-icons/ai"
import _ from "lodash"
import { useNavigate } from 'react-router-dom'
import { Select, Modal, Input, message } from 'antd'
import Loading from '../Fearture/Loading'

function Cart() {
    const navigate = useNavigate()
    const [cart, setCart] = useState([])
    const [stateMoney, setStateMoney] = useState(0)
    const [voucher, setVoucher] = useState("")
    const [down, setDown] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const dataUser = JSON.parse(localStorage.getItem("userInfo"))
    const [data, setData] = useState([])
    const [addData, setAddData] = useState({
        add: "",
        phone: "",
        mail: "",
        idUser: dataUser.id,
        cost: 0,
        name: ""

    });


    const [isVoucher, setIsVoucer] = useState(false)

    const lg = 1
    let vc = "GIAM20"

    const calc = () => {
        let money = 0
        for (let i = 0; i < cart?.length; i++) {
            setStateMoney(money = money + cart[i]?.cost)
        }
    }

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("dataBuy"))
        if (data !== null) {
            setCart(data)
            calc()
        }
    }, [])


    useEffect(() => {
        calc()
    }, [cart])

    const deleteItem = (data) => {
        if (cart?.length > 1) {
            // _.remove(cart, (e) => {
            //     return e.id === data.id
            // })
            cart.splice(data, 1)
            setCart([...cart])
            localStorage.setItem("dataBuy", JSON.stringify(cart))
        } else {
            setCart([])
            localStorage.removeItem("dataBuy")
            setStateMoney(0)
            setDown(0)
        }
    }

    const okDown = () => {
        if (voucher === "") {
            setIsVoucer(false)
            return setDown(0)
        }
        if (voucher === vc) {
            setIsVoucer(false)
            setDown(stateMoney * 0.2)
        }
        else {
            setIsVoucer(true)

        }

    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {

    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (
        <>  {
            isLoading ? <Loading /> : null
        }
            <Modal
                title="Đặt mua sản phẩm"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input
                    value={addData.name}
                    style={{ margin: "20px 0" }}
                    placeholder="Nhập địa chỉ"
                    onChange={(e) => {
                        setAddData((pre) => {
                            return { ...pre, name: e.target.value };
                        });
                    }}
                />
                <Input style={{ margin: "20px 0" }} placeholder="Nhập số điện thoại..."
                    value={addData.cost === 0 ? "" : addData.cost}
                    type="number"
                    onChange={(e) => {
                        setAddData((pre) => {
                            return { ...pre, cost: Number(e.target.value) };
                        });
                    }} />
                <Input style={{ margin: "20px 0" }} placeholder="Nhập email..."
                    value={addData.code}
                    onChange={(e) => {
                        setAddData((pre) => {
                            return { ...pre, code: e.target.value.toLocaleUpperCase() };
                        });
                    }} />

            </Modal>
            <div className="cart-container">
                <div className="cart-content">
                    <div className="cart-header">
                        Giỏ hàng của bạn
                    </div>
                    <div className="cart-body">
                        <div className="cart-right">
                            <div className="cart-right-header" style={{ marginBottom: "20px" }}>
                                <p style={{ width: "65%", textAlign: "center" }}>Tên sản phẩm</p>
                                <p style={{ width: "15%", textAlign: "center" }}>Đơn giá </p>
                                <p style={{ width: "15%", textAlign: "center" }}>Thành tiền</p>
                                <i style={{ width: "5%", textAlign: "center", cursor: "pointer" }} onClick={() => { setCart([]); setStateMoney(0); localStorage.removeItem("dataBuy") }}><AiOutlineDelete /></i>
                                {/* <p>Tổng sản phẩm

                                </p> */}
                            </div>

                            {
                                cart && cart?.map((data, index) => {
                                    return <div className="cart-right-body" style={{ alignItems: "center" }}>
                                        <div className="cart-img" style={{ width: "15%", display: "flex", justifyContent: "center" }}>
                                            <div>
                                                <img src={data.img} alt="" />
                                            </div>
                                        </div>
                                        <p style={{ width: "55%", textAlign: "left" }}>
                                            {data.name}
                                        </p>
                                        <p style={{ width: "15%", fontWeight: "600", textAlign: "center" }}>{data?.cost?.toLocaleString("it-IT", {
                                            style: "currency",
                                            currency: "VND",
                                        })}</p>
                                        <p style={{ width: "15%", fontWeight: "600", color: "#e00", textAlign: "center" }}>{Number(data?.cost * lg).toLocaleString("it-IT", {
                                            style: "currency",
                                            currency: "VND",
                                        })}</p>
                                        <i style={{ width: "5%", cursor: "pointer", textAlign: "center" }} onClick={() => { deleteItem(index) }}>
                                            <AiOutlineDelete />
                                        </i>
                                    </div>
                                })
                            }

                        </div>
                        <div className="cart-left">
                            <div className="cart-left-header">
                                <div className="voucer">
                                    <input type="text" placeholder='Nhập mã giảm giá...' onChange={(e) => setVoucher(e.target.value.trim())} value={voucher} />
                                    <button onClick={okDown}>Áp dụng</button>
                                </div>

                            </div>
                            {isVoucher ? <span style={{ fontSize: "12px", color: "#e00", textAlign: "end", display: "block" }}>Mã giảm giá không đúng hoặc hết hạn !</span> : null}
                            <div className="cart-left-body" style={{ marginTop: "20px" }}>
                                <div className="calc">
                                    <p>
                                        Tạm tính:
                                    </p>
                                    <p>
                                        {stateMoney.toLocaleString("it-IT", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </p>
                                </div>
                                <div className="down">
                                    <p>
                                        Giảm giá:
                                    </p>
                                    <p style={{ fontWeight: "600" }}>
                                        {down.toLocaleString("it-IT", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </p>
                                </div>
                                <div className="total">
                                    <p>
                                        Thành tiền:
                                    </p>
                                    <p style={{ fontWeight: "600", color: "#e00" }}>
                                        {(stateMoney - down).toLocaleString("it-IT", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </p>
                                </div>
                                <div className="buy" onClick={() => setIsModalOpen(true)}>
                                    <button >Mua sản phẩm</button>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div style={{ fontSize: "18px", margin: "50px" }} onClick={() => navigate("/")}>
                        <p style={{ fontSize: "18px", textAlign: "center", cursor: "pointer" }}>Về trang chủ</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart