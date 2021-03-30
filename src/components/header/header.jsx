import React,{Component} from 'react'
import './header.less'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import {reqWeather} from '../../api/index'
import {withRouter} from 'react-router-dom'
import menuList from "../../config/menuConfig";
import storageUtils from "../../utils/storageUtils";
import LinkButton from "../link-button";
import { Modal } from 'antd';
class Header extends Component{
    state={
        currentTime:formateDate(Date.now()),
        dayPictureUrl:'',
        weather:''
    }
    getTime=()=>{
        this.intervalId=setInterval(()=>{
            const currentTime=formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }
    getWeather=async ()=>{
        const {dayPictureUrl,weather}=await reqWeather('西安')
        this.setState({dayPictureUrl,weather})
    }

    getTitle=()=>{
        const path=this.props.location.pathname
        let title
        menuList.forEach(item=>{
            if(item.key===path){
                title=item.title
            }else if(item.children){
                const cItem=item.children.find(cItem=>cItem.key===path)
                if(cItem){
                    title=cItem.title
                }

            }

        })
        return title
    }

    logOut=()=>{
        Modal.confirm({
            //title: 'Are you sure delete this task?',
            //icon: <ExclamationCircleOutlined />,
            content: '确定退出吗',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk:()=> {
                //console.log('OK');
                storageUtils.removeUser()
                memoryUtils.user={}
                this.props.history.replace('/login')
            },
            onCancel() {
                console.log('Cancel');
            },
        })
    }
    componentDidMount() {
        this.getTime()
        this.getWeather()
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
    }

    render() {
        const {currentTime,dayPictureUrl,weather}=this.state
        const username=memoryUtils.user.username
        const title=this.getTitle()
        return(
            <div className="header">
                <div className="header-top">
                    <span>欢迎,{username}</span>
                    <LinkButton href="#" onClick={this.logOut}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)