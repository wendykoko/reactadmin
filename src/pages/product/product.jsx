import React,{Component} from 'react'
//商品管理
import ProductAddUpdate from "./add-update";
import ProductDetail from "./detail";
import ProductHome from "./home";
import {Switch,Route,Redirect} from "react-router-dom";

export default class Product extends Component{
    render() {
        return(
            <Switch>
                <Route path='/product' component={ProductHome} exact/>
                <Route path='/product/detail' component={ProductDetail}/>
                <Route path='/product/addupdate' component={ProductAddUpdate}/>
                <Redirect to='/product' />
            </Switch>
        )
    }
}