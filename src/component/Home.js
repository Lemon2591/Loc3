import React, { useEffect, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai"
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, FreeMode, Mousewheel, Keyboard } from 'swiper';
import { getSlide, getData } from "../serviceApi";
import Loading from "../Fearture/Loading"
import { Select, message } from "antd";


function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const [service, setService] = useState([])
  const [product, setProduct] = useState([])
  const [scrollPosition, setPosition] = useState(0);
  const [search, setSearch] = useState("")

  const [cart, setCart] = useState(0)
  const [data, setData] = useState([])


  const dataUser = JSON.parse(localStorage.getItem("userInfo"))

  useEffect(() => {
    setIsLoading(true)
    setTimeout(async () => {
      const data = await getSlide()
      setService(data)
      const dataProduct = await getData()
      setProduct(dataProduct)
      setData(dataProduct)
      setIsLoading(false)
    }, 500)
  }, [])

  useLayoutEffect(() => {
    function updatePosition() {
      setPosition(window.pageYOffset);
    }
    window.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);
  const handleBuy = (data) => {
    if (data.status === "Hết hàng") {
      message.error("Sản phẩm hiện đang hết hàng !")
    } {
      const dataArr = [data]
      const datas = JSON.parse(localStorage.getItem("dataBuy"))

      if (datas === null) {
        localStorage.setItem("dataBuy", JSON.stringify(dataArr))
        setCart(1)
      }
      else {
        datas.push(data);
        setCart(datas?.length)
        localStorage.setItem("dataBuy", JSON.stringify(datas))
      }
    }
  }



  useEffect(() => {
    const datas = JSON.parse(localStorage.getItem("dataBuy"))
    if (datas !== null) {
      setCart(datas?.length)
    }
  }, [])

  const handleFilter = (data) => {
    if (data === 1) {
      const test = product?.sort((a, b) => a.cost - b.cost)
      setProduct([...test])
    } else {
      const test = product?.sort((a, b) => b.cost - a.cost)
      setProduct([...test])

    }
  }

  useEffect(() => {
    if (search !== "") {
      const a = product?.filter(data => search ? data.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) : data);
      setProduct([...a])
    }
    else {
      setProduct([...data])
    }

  }, [search])

  return (
    <>
      {isLoading ? <Loading /> : null}
      <div className="home-container">
        <div className="home-content">
          <div className="home-header">
            <div className="home-header-container">
              <div className="home-header-content" style={scrollPosition > 800 ? { color: "#000" } : { color: "#fff" }}>
                <div className="home-header-logo">
                  <img src="https://salt.tikicdn.com/ts/upload/e4/49/6c/270be9859abd5f5ec5071da65fab0a94.png" alt="" />
                </div>
                <div className="home-header-search">
                  <input type="text" placeholder="Tìm kiếm..." onChange={(e) => setSearch(e.target.value.trim())} />
                  {/* <button>
                    <i><AiOutlineSearch /></i>
                  </button> */}
                </div>
                <div className="home-header-cart">
                  <div className="div" style={{ cursor: "pointer" }} onClick={() => navigate("/cart")}>
                    <i><AiOutlineShoppingCart /></i>
                    {cart ? <span>{cart}</span> : null}
                  </div>
                </div>
                <div className="home-header-login">
                  <div className="login">
                    <p>Xin chào: {dataUser?.userName}</p>
                  </div>
                </div>
                <div className="home-header-login" style={{ cursor: "pointer" }} onClick={() => { localStorage.clear(); navigate("/") }}>
                  <div className="login">
                    <p>Đăng xuất</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="home-slider">
            <Swiper
              cssMode={true}
              mousewheel={true}
              keyboard={true}

              spaceBetween={30}
              centeredSlides={true}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}


              modules={[Autoplay, Pagination, Navigation]}
              className='mySwiper'
            >
              {service && service?.map((data, index) => {
                return <SwiperSlide><div className="img-slider" key={index}>
                  <img src={data.img} alt=""></img>
                </div></SwiperSlide>
              })}


            </Swiper>
          </div>
          <div className="home-body">
            <div className="home-body-container">
              <div className="home-body-content">
                <h1>Sản phẩm của chúng tôi</h1>
                <div className="filter" style={{ margin: "50px 0" }}>
                  <Select

                    placeholder="Sắp xếp sản phẩm..."
                    style={{ width: "30%" }}
                    onChange={(data) => handleFilter(data)}
                    options={[
                      { value: 1, label: 'Thấp đến Cao' },
                      { value: 2, label: 'Cao đến Thấp' },

                    ]}
                  />
                </div>
                <div className="home-body-items">

                  {product?.map((data, index) => {
                    return <div className="home-body-item" key={index}>
                      <div className="img-item">
                        <img src={data.img} alt="" />
                      </div>
                      <div className="code-item">
                        <span>MÃ: {data.code}</span>
                      </div>
                      <div className="name-item">
                        <span>{data.name}</span>
                      </div>
                      <div className="cost-item">
                        <span>{Number(data.cost).toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })}</span>
                      </div>
                      <div className="status-item">
                        <span style={data.status === "Còn hàng" ? { color: "#2cc067" } : { color: "#cf1322" }}>{data.status}</span>
                      </div>
                      <div className="buy-btn">
                        <button onClick={() => handleBuy(data)}>Thêm vào giỏ hàng</button>
                      </div>
                    </div>
                  })}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  );
}

export default Home;
