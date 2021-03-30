import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input,
    Tree
} from 'antd'
import menuList from "../../config/menuConfig";

const Item = Form.Item
const { TreeNode } = Tree;
/*
添加分类的form组件
 */
export default class AuthForm extends Component {
    constructor(props) {
        super(props);
        const menus=this.props.role
        this.state={
            checkedKeys:menus
        }
    }
    static propTypes = {
        role:PropTypes.object // 用来传递form对象的函数
    }
    getTreeNodes=(menuList)=>{
        return menuList.reduce((pre,item)=>{
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children?this.getTreeNodes(item.children):null}
                </TreeNode>
            )
            return pre
        },[])
    }
    //为父组件提供获取最新menus
    getMenus=()=>this.state.checkedKeys

    componentWillMount() {
        this.treeNodes=this.getTreeNodes(menuList)
    }
    //选中node时更新回调
    onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    };
    //根据新传入的role更新checkedKeys状态
    componentWillReceiveProps(nextProps) {
        const menus=nextProps.role.menus
        this.setState({
            checkedKeys:menus
        })
    }

    render() {
        const {role}=this.props
        const {checkedKeys}=this.state
        const formItemLayout = {
            labelCol: { span: 4 },  // 左侧label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
        }

        return (
            <div>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title='平台权限' key='all'>
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}