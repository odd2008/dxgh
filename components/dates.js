import React,{Component} from 'react';
import Page from './common/page';
import {Cells,Cell,CellBody,CellFooter,Badge,CellsTitle,CellHeader,Panel,PanelHeader,PanelBody,MediaBox,MediaBoxHeader,MediaBoxBody,MediaBoxTitle,MediaBoxDescription} from 'react-weui';
import {Link} from 'react-router';
import {frontDepartmentPaiban} from '../ajax';
export default class Dates extends Component {

	constructor(props) {
	  super(props);
	  this.state = {
	  	loading:false,
	  	tDate:null,
	  	kid:this.props.params.kid,//科室id
	  	kname:'加载中...',//科室名称
	  	index:0,
	  	datas:[]
	  };
	}
	componentWillMount() {
		this._loadData();
	}

	_loadData(){
		this.setState({
			loading:true
		});
		frontDepartmentPaiban({
			depId:this.state.kid,
			callBack:(res) => {
				this.setState({
					datas : res.datas,
					tDate : res.datas[this.state.index].online_date,
					kname : res.depName,
					loading:false
				});
			}
		});
	}
	//切换时间改变数据
	_changeDate(index,date){
		this.setState({
			index:index,
			tDate:date
		});
	}
	render(){
		return(
			<Page loading={this.state.loading}>
				<Cells>
					<Cell>
						<CellHeader>
							<span style={{marginRight:'5px',fontSize:'2em'}} className="ion-ios-checkmark-empty"></span>
						</CellHeader>
						<CellBody>
							已选
						</CellBody>
						<CellFooter>
							{this.state.kname}
						</CellFooter>
					</Cell>
				</Cells>
				<DateTable index = {this.state.index} changeDate = {this._changeDate.bind(this)} dataSource={this.state.datas}/>
				{
					this.state.datas.length !==0 ? <DateList tDate={this.state.tDate} kId={this.state.kid} dataSource={this.state.datas[this.state.index].tlist}/> : null
				}
			</Page>
		)
	}
}

class DateTable extends Component{
	render(){
		return(
			<div className="datas-table">
				{
					this.props.dataSource.map((ele,index)=>{
						console.log(this.props.index == index);
						return(
							<div className={this.props.index == index ? 'active' : null} onClick={()=>{this.props.changeDate(index,ele.online_date)}} key={Math.random()}>
								<span>{ele.online_date.slice(8)}</span><span>{ele.week_day.slice(2)}</span>
							</div>
						)
					})
				}
			</div>
		)
	}
}

class DateList extends Component{
	render(){
		return(
			<Cells>
				<CellsTitle>
                    可预约医生列表
                </CellsTitle>
	                {
	                	typeof(this.props.dataSource) != 'undefined' ? this.props.dataSource.map((ele,index)=>{
	                		return(
			                	<Cell access key={Math.random()} type="appmsg" href={`#/times/${this.props.kId}/${this.props.tDate}/${ele.doc_id}`}>
			                		<CellHeader>
			                			<span style={{marginRight:'5px',fontSize:'2em'}} className="ion-ios-person"></span>
			                		</CellHeader>
			                		<CellBody>
		                                <p>{ele.doc_name}</p>
		                                <p>{ele.unit_price}</p>
		                                <p>
		                                    {
		                                    	typeof(ele.marks) != 'undefined' ? ele.marks.map((item)=>{
		                                    		return(
		                                    			<Badge key={Math.random()} preset="body">{item}</Badge>
		                                    		)
		                                    	}) : null
		                                    }
		                                </p>
		                                <p>
		                                	<Badge preset="body">{ele.day_part == 1 ? '上午' : '下午'}</Badge>
		                                </p>
		                            </CellBody>
		                            <CellFooter/>
			                	</Cell>  
	                		)
	                	}) : null
	                }
			</Cells>
		)
	}
}