import React,{Component} from 'react'
import './left-nav.less'
import {Link,withRouter} from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { Menu ,Icon} from 'antd';
import menuList from "../../config/menuConfig";
import {
    AppstoreOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined,
} from '@ant-design/icons';
import memoryUtils from "../../utils/memoryUtils";

const { SubMenu } = Menu;


class LeftNav extends Component{
    //判断当前登陆用户对item是否有权限
    hasAuth=(item)=>{
        const {key,isPublic}=item
        const menus=memoryUtils.user.role.menus
        const username=memoryUtils.user.username
        /*
    1. 如果当前用户是admin
    2. 如果当前item是公开的
    3. 当前用户有此item的权限: key有没有menus中
     */
        if(username==='admin'||isPublic||menus.indexOf(key)!==-1){
            return true
        }else if(item.children){
            return !!item.children.find(child=> menus.indexOf(child.key)!==-1)
        }
        return false
    }
    /*
  根据menu的数据数组生成对应的标签数组
  使用map() + 递归调用
  */
    getMenuNodes = (menuList) => {
        // 得到当前请求的路由路径
        const path = this.props.location.pathname

        return menuList.reduce((pre, item) => {

            // 如果当前用户有item对应的权限, 才需要显示对应的菜单项
            if (this.hasAuth(item)) {
                // 向pre添加<Menu.Item>
                if(!item.children) {
                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {

                    // 查找一个与当前请求路径匹配的子Item
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                    // 如果存在, 说明当前item的子列表需要打开
                    if (cItem) {
                        this.openKey = item.key
                    }


                    // 向pre添加<SubMenu>
                    pre.push((
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </span>
                            }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }

            return pre
        }, [])
    }
    componentWillMount() {
        this.menuNodes=this.getMenuNodes(menuList)
    }

    render() {
        let path=this.props.location.pathname
        const openKey=this.openKey
        if(path.indexOf('/product')===0){
            path='/product'
        }

        return(

                <div className="left-nav">
                    <Link to='/' className='left-nav-header'>
                        <img src={logo} alt="logo" />
                        <h1>硅谷后台</h1>
                    </Link>

                    <Menu
                        selectedKeys={[path]}
                        defaultOpenKeys={[openKey]}
                        mode="inline"
                        theme="dark"
                    >

                        {
                            this.menuNodes
                        }

                    </Menu>
                </div>

        )
    }
}

export default withRouter(LeftNav)