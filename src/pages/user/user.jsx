import React,{Component} from 'react'
import {Card, Table, Button, Icon, Input, message, Modal} from "antd";
import {formateDate} from "../../utils/dateUtils";
import LinkButton from "../../components/link-button";
import {PAGE_SIZE} from "../../utils/constants";
import AddForm from "../category/add-form";
import {reqUsers,reqDeleteUser,reqAddOrUpdateUser} from "../../api";
import UserForm from "./user-form";
//Y用户
const { confirm } = Modal;
export default class User extends Component{
    state={
        users:[],//用户列表
        roles:[],//角色列表
        isShow:false//是否显示确认框
    }
    initialRoleNames=(roles)=>{
        const roleNames=roles.reduce((pre,role)=>{
            pre[role._id]=role.name
            return pre
        },{})
        this.roleNames=roleNames
    }
    initialColumns=()=>{
        this.columns=[
            {
                title:'用户名称',
                dataIndex:'username'
            },
            {
                title:'邮箱',
                dataIndex:'email'
            },{
                title:'电话',
                dataIndex:'phone'
            },{
                title:'注册时间',
                dataIndex:'create_time',
                render:formateDate
            },{
                title:'所属角色',
                dataIndex:'role_id',
                render:(role_id)=>this.roleNames[role_id]
            },{
                title:'操作',
                render:(user)=>(
                    <span>
                        <LinkButton onClick={()=>this.showUpDate(user)}>修改</LinkButton>&nbsp;&nbsp;&nbsp;
                        <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }
    showUpDate=(user)=>{
        this.user=user //保存user
        this.setState({
            isShow:true
        })
    }
    deleteUser=(user)=>{
        confirm({
            title: `确认删除${user.username}吗?`,
            onOk:async ()=> {
                const result=await reqDeleteUser(user._id)
                if(result.status===0){
                    message.success('删除成功')
                    this.getUsers()
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    addOrUpdateUser=async ()=>{
        this.setState({isShow:false})
    //收集数据
        const user=this.form.getFieldsValue()
        this.form.resetFields()
        //提交添加请求
        if(this.user){
          user._id=this.user._id
        }
        const result =await reqAddOrUpdateUser(user)
        //更新列表显示
        if(result.status===0){
            message.success(`${this.user ? '修改' : '添加'}用户成功`)
            this.getUsers()
        }

    }
    getUsers=async ()=>{
        const result=await reqUsers()
        if(result.status===0){
            const {roles,users}=result.data
            this.initialRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }
    showAdd=()=>{
        this.user=null
        this.setState({isShow:true})
    }
    componentWillMount() {
        this.initialColumns()
    }
    componentDidMount() {
        this.getUsers()
    }

    render() {
        const {users,isShow,roles}=this.state
        const user = this.user || {}
        const title=<Button type='primary' onClick={this.showAdd}>创建用户</Button>
        return(
            <Card title={title}>
                <Table
                    dataSource={users}
                    //loading={loading}
                    bordered={true}
                    rowKey='_id'
                    columns={this.columns}
                    pagination={{
                        defaultPageSize:PAGE_SIZE,
                    }}
                />
                    <Modal
                        title={user._id?'修改用户':'添加用户'}
                        visible={isShow}
                        onOk={this.addOrUpdateUser}
                        onCancel={()=>{
                            this.form.resetFields()
                            this.setState({isShow:false})
                        }}
                    >
                        <UserForm
                            setForm={form=>this.form=form}
                            roles={roles}
                            user={user}
                        />
                    </Modal>
            </Card>
        )
    }
}