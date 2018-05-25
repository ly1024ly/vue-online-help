import { Message } from 'element-ui';
export function showSuccess(data){
	Message.success(data);
}
export function showError(data){
	Message.error(data);
}
//根据服务端返回的错误数据中的错误码，显示对应的错误信息。
export  function showServerError(data,vm){
  console.log(data)
    if(typeof(data) !== 'undefined' && data.result&&data.result === "fail"){
        if(data.errorno ) {
			Message.error(vm.$t('message.error_no_' + data.errorno));
		} 
	}
}