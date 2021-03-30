import React,{Component} from 'react'
import {Card, Button, Table, Modal,message} from "antd";
import {initMetric} from "web-vitals/dist/modules/lib/initMetric";
import {reqRoleList,reqAddRole,reqUpdateRole} from "../../api";
import AddForm from "./add-form";
import AuthForm from "./auth-form"
import {formateDate} from "../../utils/dateUtils";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";

export default class Role extends Component{
    state={
        roles:[],//角色列表
        role:{},//选中角色
        showAdd:false,
        showAuth:false,
    }
    constructor(props) {
        super(props);
        this.auth=React.createRef()
    }
    reqRole=async ()=>{
        const result = await reqRoleList()
        if(result.status===0){
            const roles=result.data
            this.setState({roles})
        }
    }
    initColumns=()=>{
        this.columns=[
            {
                title:'角色名称',
                dataIndex:'name'
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                render:(create_time)=>formateDate(create_time)
            },
            {
                title:'授权时间',
                dataIndex:'auth_time',
                render:formateDate
            },
            {
                title:'授权人',
                dataIndex:'auth_name'
            },
        ]
    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.reqRole()
    }

    onRow=(role)=>{
        return {
            onClick:event=>{
                //alert('点击行')
                this.setState({role})
            }
        }
    }
    addRole=()=>{
        this.form.validateFields(async (error,values)=>{
            if(!error){
                //隐藏框
                this.setState({
                    showAdd: false
                })

                const {roleName}=values
                const result=await reqAddRole(roleName)
                if(result.status===0){
                    message.success('添加成功')
                    const role=result.data
                    this.setState(state=>({
                        roles:[...state.roles,role]
                    }))
                }else{
                    message.error('添加失败')
                }

            }
        })
    }
    updateRole=async ()=>{
        // 隐藏确认框
        this.setState({
            showAuth: false
        })

        const role=this.state.role
        const menus=this.auth.current.getMenus()

        role.menus=menus
        role.auth_name=memoryUtils.user.username
        role.auth_time=Date.now()
        const result=await reqUpdateRole(role)
        if(result.status===0){
            if(role._id===memoryUtils.user.role_id){
                memoryUtils.user={}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前用户权限修改，重新登录')
            }else{
                message.success('设置权限成功')
                this.setState({
                    roles:[...this.state.roles]
                })
            }
        }
    }

    render() {
        const {roles,role,showAdd,showAuth}=this.state
        const title=(
            <span>
                <Button type='primary' onClick={()=>this.setState({showAdd:true})}>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={()=>this.setState({showAuth:true})}>设置角色权限</Button>
            </span>
        )
        return(
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    columns={this.columns}
                    dataSource={roles}
                    pagination={{defaultPageSize: 5, showQuickJumper: true}}
                    rowSelection={{
                        type:'radio',
                        selectedRowKeys:[role._id],
                        onSelect:(role)=>{
                            this.setState({
                                role
                            })
                        }
                    }}
                    onRow={this.onRow}
                />
                <Modal
                    title="添加角色"
                    visible={showAdd}
                    onOk={this.addRole}
                    onCancel={()=>{
                        this.setState({showAdd: false})
                        this.form.resetFields()
                    }}
                >
                    <AddForm
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={showAuth}
                    //onOk={this.updateRole}
                    onOk={this.updateRole}
                    onCancel={()=>{
                        this.setState({showAuth: false})
                    }}
                >
                    <AuthForm role={role} ref={this.auth}
                    />
                </Modal>
            </Card>
        )
    }
}