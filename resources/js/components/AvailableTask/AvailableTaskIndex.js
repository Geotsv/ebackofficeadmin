import React from 'react';
import ServerTable from '../ServerTable';
import { AiFillDelete, AiFillEdit, AiFillPlusSquare, AiFillMinusSquare } from "react-icons/ai";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";
import {
    Header,
    Icon
} from "semantic-ui-react";
import swal from 'sweetalert'

import '../../../css/AvailableTask.css';
class AvailableTaskIndex extends React.Component {
    state = {
        selectedAvailableTasks: [],
        availableTasksIDs: [],
        isAllChecked: false,
        deleting: false,
        currentPage: 1,
        limit: this.props.perPage,
    };

    async componentDidMount() {
        await this.goToPage()
        await this.setDropDownValue()
    }

    goToPage = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        let i = 0;
        while (this.state.availableTasksIDs.length <= 0 && i < 100) {
            await this.sleep(1000);
            i += 1;
        }
        const paginationLinks = document.getElementsByClassName("page-link");
        paginationLinks[urlParams.get('page')].click()
    }

    sleep = async (msec) => {
        return new Promise(resolve => setTimeout(resolve, msec));
    }

    setDropDownValue = async () => {
        let pageSelect = document.getElementsByTagName("select")[0];
        const urlParams = new URLSearchParams(window.location.search);
        pageSelect.value = urlParams.get('limit');
    }

    check_all = React.createRef();

    handleCheckboxTableChange = (event) => {
        const value = event.target.value;
        let selectedAvailableTasks = this.state.selectedAvailableTasks.slice();

        selectedAvailableTasks.includes(value) ?
            selectedAvailableTasks.splice(selectedAvailableTasks.indexOf(value), 1) :
            selectedAvailableTasks.push(value);

        this.setState({ selectedAvailableTasks: selectedAvailableTasks }, () => {
            this.check_all.current.checked = _.difference(this.state.availableTasksIDs, this.state.selectedAvailableTasks).length === 0;
        });
    }

    handleCheckboxTableAllChange = (event) => {
        this.setState({ selectedAvailableTasks: [...new Set(this.state.selectedAvailableTasks.concat(this.state.availableTasksIDs))] }, () => {
            this.check_all.current.checked = _.difference(this.state.availableTasksIDs, this.state.selectedAvailableTasks).length === 0;
        });
    }

    handleDelete = async (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you won't be able to recover the data.",
            icon: "warning",
            buttons: ["Cancel", "Delete"],
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                this.setState({ deleting: true })
                const res = await axios.delete(`${process.env.MIX_API_URL}/availableTasks/${id}`);
                if (res.data.status === 200) {
                    this.setState({ deleting: false })
                }
            }
        });
    };

    handleDeleteMany = async () => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you won't be able to recover the data.",
            icon: "warning",
            buttons: ["Cancel", "Delete"],
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                this.setState({ deleting: true })
                const { selectedAvailableTasks } = this.state
                let selectedAvailableTaskIds = selectedAvailableTasks.map(Number);
                const res = await axios.post(`${process.env.MIX_API_URL}/availableTasks/deleteMany`, {
                    selectedAvailableTaskIds: selectedAvailableTaskIds
                });
                if (res.data.status === 200) {
                    this.setState({ deleting: false })
                }
            }
        });
    }

    render() {
        let { deleting, currentPage, limit } = this.state;
        let self = this;
        const url = `${process.env.MIX_API_URL}/availableTasks`;
        const columns = ['id', 'name', 'description', 'actions']
        let checkAllInput = (<input type="checkbox" ref={this.check_all} onChange={this.handleCheckboxTableAllChange} />);
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('limit')) { limit = urlParams.get('limit') }
        if (urlParams.get('page')) { currentPage = urlParams.get('page') }
        const options = {
            perPage: limit,
            perPageValues: [5, 10, 20, 25, 100],
            currentPage: currentPage,
            headings: { id: checkAllInput },
            sortable: ['name', 'description'],
            requestParametersNames: { query: 'search', direction: 'order' },
            responseAdapter: function (res) {
                let availableTasksIDs = res.data.map(a => a.id.toString());
                self.setState({ availableTasksIDs: availableTasksIDs }, () => {
                    self.check_all.current.checked = _.difference(self.state.availableTasksIDs, self.state.selectedAvailableTasks).length === 0;
                });

                return { data: res.data, total: res.total }
            },
            texts: {
                show: 'Available Tasks  '
            },
        };

        return (
            <div>
                <Header as='h2' icon textAlign='center'>
                    <Icon name='list ul' circular />
                    <Header.Content>Available Tasks</Header.Content>
                </Header>
                <button className="btn btn-primary create" style={{ marginRight: "8px" }}>
                    <Link to={'availableTasks/create'}>
                        <div style={{ color: "white" }} >
                            <AiFillPlusSquare color="white" size="20" style={{ marginBottom: "2px" }} />
                            <span style={{ marginLeft: "8px" }} >
                                Create
                            </span>
                        </div>
                    </Link>
                </button>
                <button className="btn btn-danger delete" onClick={() => { self.handleDeleteMany() }}>
                    <div style={{ color: "white" }} >
                        <AiFillMinusSquare color="white" size="20" style={{ marginBottom: "2px" }} />
                        <span style={{ marginLeft: "8px" }} >
                            Delete Selected
                        </span>
                    </div>
                </button>
                {
                    deleting ? <Spinner /> :
                        <ServerTable columns={columns} url={url} options={options} bordered hover updateUrl>
                            {
                                function (row, column) {
                                    const editPathProps = {
                                        pathname: 'availableTasks/' + row.id + '/edit',
                                        limit: limit,
                                        currentPage: currentPage,
                                    };
                                    switch (column) {
                                        case 'id':
                                            return (
                                                <input key={row.id.toString()} type="checkbox" value={row.id.toString()}
                                                    onChange={self.handleCheckboxTableChange}
                                                    checked={self.state.selectedAvailableTasks.includes(row.id.toString())} />
                                            );
                                        case 'actions':
                                            return (
                                                <div style={{ display: "flex", justifyContent: "start" }}>
                                                    <button className="btn btn-primary" style={{ marginRight: "5px" }}>
                                                        <Link to={editPathProps}>
                                                            <AiFillEdit color="white" style={{ float: "left", marginTop: "4px" }} />
                                                            <div style={{ color: "white", float: "left", marginLeft: "3px", paddingBottom: "3px" }} >
                                                                Edit
                                                            </div>
                                                        </Link>
                                                    </button>
                                                    <button className="btn btn-danger" style={{ marginLeft: "5px" }} onClick={() => { self.handleDelete(row.id) }}>
                                                        <AiFillDelete color="white" style={{ float: "left", marginTop: "4px" }} />
                                                        <div style={{ color: "white", float: "left", marginLeft: "3px", paddingBottom: "3px" }}>
                                                            Delete
                                                        </div>
                                                    </button>
                                                </div>

                                            );
                                        default:
                                            return (row[column]);
                                    }
                                }
                            }
                        </ServerTable >
                }</div>
        );
    }
}

export default AvailableTaskIndex;