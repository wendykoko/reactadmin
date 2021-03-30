import React,{Component} from 'react'
import {
    Card,
    List,
    Icon,
} from "antd";
import './product.less'
import com1 from './images/com.jpg'
import com2 from './images/computer.png'
import LinkButton from "../../components/link-button";
import {reqCategory} from "../../api";
import {BASE_IMG_URL} from "../../utils/constants";


export default class ProductDetail extends Component{
    state = {
        cName1: '', // 一级分类名称
        cName2: '', // 二级分类名称
    }

    render() {
        const {name, desc, price, detail, imgs} = this.props.location.state.product
//        const {cName1, cName2} = this.state
        const title=(
            <span>
                <LinkButton>
                    <Icon
                        type='arrow-left'
                        style={{marginRight:15,fontSize:20}}
                        onClick={()=>{this.props.history.goBack()}}
                    ></Icon>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return(
            <Card title={title} className='detail'>
                <List>
                    <List.Item className='justl'>
                        <span className='left'>商品名称：</span>
                        <span>{name}</span>
                    </List.Item>
                    <List.Item className='justl'>
                        <span className='left'>商品描述：</span>
                        <span>{desc}</span>
                    </List.Item>
                    <List.Item className='justl'>
                        <span className='left'>商品价格：</span>
                        <span>{price}元</span>
                    </List.Item>
                    <List.Item className='justl'>
                        <span className='left'>所属分类：</span>
                    </List.Item>
                    <List.Item className='justl'>
                        <span className='left'>商品图片：</span>
                        <span></span>
                    </List.Item>
                    <List.Item className='justl'>
                        <span className='left'>商品详情：</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}>
                        </span>
                    </List.Item>
                </List>
            </Card>
        )
    }
}