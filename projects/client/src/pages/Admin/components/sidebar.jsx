import SideItem from "./sideItem"
import {FiHome, FiUsers, FiShoppingBag, FiTag, FiTruck, FiShoppingCart, FiShuffle, FiBarChart} from "react-icons/fi"
import { useState, useEffect } from "react"
import { Toaster } from "react-hot-toast"

export default function Sidebar() {
const path = window.location.pathname
const newPath = path==="/admin"?"home" : path.split('/')[2]

const [activePath, setActivePath] = useState({
    home: "inactive",
    user: "inactive",
    product: "inactive",
    category: "inactive",
    warehouse: "inactive",
    order: "inactive",
    mutation: "inactive",
    dashboard: "inactive",
})

useEffect(() => {
    setActivePath({
        ...activePath,
        [newPath]: "active"
    })
}, [path])



    return (
        <div className="w-[200px]">
            <div className="bg-white w-[200px] fixed h-screen text-4xl font-ibmBold flex items-start z-20 shadow-md flex-col" >
                <SideItem icon={FiHome} title="Home" active={activePath.home} path="/admin"/>
                <SideItem icon={FiUsers} title="User" active={activePath.user} path="/admin/user"/>
                <SideItem icon={FiShoppingBag} title="Product" active={activePath.product} path="/admin/product"/>
                <SideItem icon={FiTag} title="Category" active={activePath.category} path="/admin/category"/>
                <SideItem icon={FiTruck} title="Warehouse" active={activePath.warehouse} path="/admin/warehouse"/>
                <SideItem icon={FiShoppingCart} title="Order" active={activePath.order} path="/admin/order"/>
                <SideItem icon={FiShuffle} title="Mutation" active={activePath.mutation} path="/admin/mutation"/>
                <SideItem icon={FiBarChart} title="Dashboard" active={activePath.dashboard} path="/admin/dashboard"/>
            </div>
        </div>
    )
}