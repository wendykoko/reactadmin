import ajax from './ajax'
// 登陆
import jsonp from 'jsonp'
const BASE=''
export const reqLogin = (username, password) => ajax(BASE+'/login', {username, password}, 'POST')


//获取一级/二级分类列表
export const reqCategorys=(parentId)=>ajax(BASE+'/manage/category/list',{parentId})
//添加分类
export const reqAddCategory=(categoryName,parentId)=>ajax(BASE+'/manage/category/add',{categoryName,parentId},'POST')

//更新分类
export const reqUpdateCategory=(categoryId,categoryName)=>ajax(BASE+'/manage/category/update',{categoryId,categoryName},'POST')
//获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})
//更新
export const reqUpdateStatus=(productId,status)=>ajax(BASE+'/manage/product/updateStatus',{productId,status},'POST')
//删除图片
export const deleteImg=(name)=>ajax(BASE+'/manage/img/delete',{name},'POST')
//获取商品分页列表
export const reqProducts=(pageNum,pageSize)=>ajax(BASE+'/manage/product/list',{pageNum,pageSize})
//搜索商品分类页表
export const reqSearchProducts=({pageNum, pageSize, searchName, searchType})=>ajax(BASE+'/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName,
})
//添加更新商品
export const reqAddOrUpdateProduct=(product)=>ajax(BASE+'/manage/product/'+(product._id?'update':'add'),product,'POST')
export function reqWeather(city) {
    const url =
        'http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2'
    return new Promise((resolve, reject) => {
        jsonp(url, {
            param: 'callback'
        }, (error, response) => {
            if (!error && response.status == 'success') {
                const {dayPictureUrl, weather} = response.results[0].weather_data[0]
                resolve({dayPictureUrl, weather})
            } else {
                alert('获取天气信息失败')
            }
        })
    })
}

//获取角色列表
export const reqRoleList=()=>ajax(BASE+'/manage/role/list')
//添加角色
export const reqAddRole=(roleName)=>ajax(BASE+'/manage/role/add',{roleName},'POST')
//更新角色
export const reqUpdateRole=(role)=>ajax(BASE+'/manage/role/update',role,'POST')
//获取列表所有用户
export const reqUsers=()=>ajax(BASE+'/manage/user/list')
//删除用户
export const reqDeleteUser=(userId)=>ajax(BASE+'/manage/user/delete', {userId},'POST')
//添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE+'/manage/user/'+(user._id?'update':'add'), user, 'POST')
