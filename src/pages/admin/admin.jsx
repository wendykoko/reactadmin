import React,{Component} from 'react'
//后台管理的路由组件
import {Redirect,Route,Switch} from 'react-router-dom'
import memoryUtils from "../../utils/memoryUtils";
import { Layout } from 'antd';
import LeftNav from "../../components/left-nav/left-nav";
import Header from '../../components/header/header'
import Home from "../home/home";
import Category from "../category/category";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";
import Product from "../product/product";
import Role from "../role/role";
import User from "../user/user";

const { Footer, Sider, Content } = Layout;
export default class Admin extends Component{
    render() {
        const user=memoryUtils.user
        if(!user||!user._id){
            return <Redirect to='/login' />
        }
        return(
              //外面大括号代表js代码，里面大括号代表js对象
                <Layout style={{minHeight:'100%'}}>
                    <Sider>
                        <LeftNav />
                    </Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Content style={{backgroundColor:"#fff",margin:"20px"}}>
                            <Switch>
                                <Route path='/home' component={Home}/>
                                <Route path='/category' component={Category}/>
                                <Route path='/product' component={Product}/>
                                <Route path='/role' component={Role}/>
                                <Route path='/user' component={User}/>
                                <Route path='/charts/bar' component={Bar}/>
                                <Route path='/charts/line' component={Line}/>
                                <Route path='/charts/pie' component={Pie}/>
                                <Redirect to='/home' />

                            </Switch>
                        </Content>
                        <Footer style={{textAlign:'center',color:'#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳体验</Footer>
                    </Layout>
                </Layout>

        )
    }
}