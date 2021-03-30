import React,{Component} from 'react'
import {
    Card,
    Form,
    Upload,
    Cascader,
    Button,
    Icon,
    Input,
    message
} from "antd";
import LinkButton from "../../components/link-button";
import {reqCategorys,reqAddOrUpdateProduct} from "../../api";
import PicturesWall from './pictures-wall'
import RichTextEditor from "./rich-text-editor";
const {TextArea}= Input



class ProductAddUpdate extends Component{
    state={
        options:[],
    }
    constructor(props) {
        super(props);

        this.pw=React.createRef()
        this.editor=React.createRef()
    }
    initOptions=async (categorys)=>{
        const options=categorys.map(c=>({
            value:c._id,
            label:c.name,
            isLeaf:false
        }))
        //二级分类商品更新
        const {isUpdate,product}=this
        const {pCategoryId}=product
        if(isUpdate&&pCategoryId!=='0'){
            //获取二级列表
            const subOptions=await reqCategorys(pCategoryId)
            // 生成二级下拉列表的options
            const childOption=subOptions.map(c=>({
                value:c._id,
                label:c.name,
                isLeaf:true
            }))

            // 找到当前商品对应的一级option对象
            const targetOption=options.find(option=>option.value===pCategoryId)
            // 关联对应的一级option上
            targetOption.children=childOption
        }

        this.setState({options})
    }
    getCategorys=async (parentId)=>{
        const result=await reqCategorys(parentId)
   //     console.log(result.data)
        if(result.status===0){
            const categorys=result.data
            if(parentId==='0'){
                //console.log(categorys)
                this.initOptions(categorys)
            }else{
                //二级列表
                return categorys
            }


        }
    }
    onSubmit=()=>{
        this.props.form.validateFields(async (errors, values) => {
            if(!errors){
                //封装product组件
                const {price,desc,name,categoryIds}=values
                let pCategoryId,categoryId
                if(categoryIds.length===1){
                    pCategoryId='0'
                    categoryId=categoryIds[0]
                }else{
                    pCategoryId=categoryIds[0]
                    categoryId=categoryIds[1]
                }
                const imgs=this.pw.current.getImgs()
                const detail=this.editor.current.getDetail()
                const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}
                //如果是更新，存在_id
                if(this.isUpdate){
                    product._id=this.product._id
                }
                console.log(product)
                //用请求接口用product更新
                const result=await reqAddOrUpdateProduct(product)
                console.log(result)
                //根据结果提示
                if (result.status===0){
                    message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
                }
                console.log(detail)
            }else {
                alert('fail')
            }
        })
    }
    validatePrice = (rule, value, callback) => {
        console.log(value, typeof value)
        if (value*1 > 0) {
            callback() // 验证通过
        } else {
            callback('价格必须大于0') // 验证没通过
        }
    }
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;
        // 根据选中的分类, 请求获取二级分类列表
        const subCategorys=await this.getCategorys(targetOption.value)
        // 隐藏loading
        targetOption.loading = false
        //二级分类数组有数据
        if(subCategorys&&subCategorys.length>0){
            const childOptions=subCategorys.map(c=>({
                value:c._id,
                label:c.name,
                isLeaf:true
            }))
            targetOption.children=childOptions
        }else{
            targetOption.isLeaf=true
        }

    };
    componentWillMount() {
        const product=this.props.location.state
        this.isUpdate=!!product
        this.product=product||{}
    }

    componentDidMount() {
        this.getCategorys('0')
    }

    render() {
        const {isUpdate,product}=this
        const {pCategoryId,categoryId,imgs,detail}=product
        const categoryIds=[]
        if(isUpdate){
            if(pCategoryId==='0') {
                categoryIds.push(categoryId)
            } else {
                // 商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        //console.log(categoryIds)
        const title=(
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{marginRight:10,fontSize:20}}/>
                    <span style={{color:"black"}}>{isUpdate?'修改商品':'添加商品'}</span>
                </LinkButton>

            </span>
        )
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };
        const {getFieldDecorator}=this.props.form
        return(
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Form.Item label="商品名称">
                        {
                            getFieldDecorator('name',{
                                initialValue:product.name,
                                rules:[
                                    {
                                        required:true,message:'必须输入商品名称'
                                    }
                                ]
                            })(<Input placeholder='请输入商品名称' />)
                        }
                    </Form.Item>
                    <Form.Item label="商品描述">
                        {
                            getFieldDecorator('desc',{
                                initialValue:product.desc,
                                rules:[
                                    {
                                        required:true,message:'必须输入商品描述'
                                    }
                                ]
                            })(<TextArea placeholder='请输入商品描述' autoSize={{minRows:2,maxRows:6}}></TextArea>)
                        }
                    </Form.Item>
                    <Form.Item label="商品价格">
                        {
                            getFieldDecorator('price',{
                                initialValue:product.price,
                                rules:[
                                    {
                                        required:true,message:'必须输入商品价格'
                                    },
                                    {validator: this.validatePrice}
                                ]
                            })(<Input type='number' placeholder='请输入商品价格' addonAfter='元'/>)
                        }
                    </Form.Item>
                    <Form.Item label="商品分类">
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules: [
                                    {required: true, message: '必须指定商品分类'},
                                ]
                            })(
                                <Cascader
                                    placeholder='请指定商品分类'
                                    options={this.state.options}  /*需要显示的列表数据数组*/
                                    loadData={this.loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
                                />
                            )
                        }
                    </Form.Item>
                    <Form.Item label="商品图片">
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Form.Item>
                    <Form.Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' onClick={this.onSubmit}>提交</Button>
                    </Form.Item>

                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate)