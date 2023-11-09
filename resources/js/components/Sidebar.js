import React from "react";
import { ProSidebar, SubMenu, Menu, MenuItem, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import {
    FaBattleNet, FaAdn, FaArtstation, FaGem, FaFantasyFlightGames, FaCriticalRole, FaDrupal, FaFreebsd,
    FaGitter, FaGratipay, FaGrav, FaGripfire, FaBalanceScale, FaFire
} from "react-icons/fa";
import Home from "./Home"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";
import UserIndex from "./User/UserIndex";
import UserCreate from "./User/UserCreate";
import UserEdit from "./User/UserEdit";
import UserChangePassword from "./User/UserChangePassword";
import CustomerIndex from './Customer/CustomerIndex';
import CustomerCreate from './Customer/CustomerCreate';
import CustomerEdit from "./Customer/CustomerEdit";
import Event from "./Event/Event";
import FileManager from "./FileManager";
import AvailableTaskIndex from './AvailableTask/AvailableTaskIndex';
import AvailableTaskCreate from './AvailableTask/AvailableTaskCreate';
import AvailableTaskEdit from "./AvailableTask/AvailableTaskEdit";
import AnnouncementIndex from "./Announcement/AnnouncementIndex";
import AnnouncementCreate from "./Announcement/AnnouncementCreate";
import AnnouncementEdit from "./Announcement/AnnouncementEdit";
import SentAnnouncementsIndex from "./Announcement/SentAnnouncementsIndex";
// import ReadPage from "./Announcement/ReadPage";
import TaskListIndex from './TaskList/TaskListIndex';
import TaskListCreate from './TaskList/TaskListCreate';
import TaskListEdit from "./TaskList/TaskListEdit";
import MyTaskIndex from "./MyTask/MyTaskIndex";
import PreferenceEdit from "./Preferences/PreferenceEdit";
import AuditIndex from "./Audit/AuditIndex";
import AuditEdit from "./Audit/AuditEdit";
import Spinner from "./Spinner";

import '../../css/App.css';
import 'react-pro-sidebar/dist/css/styles.css';


class Sidebar extends React.Component {
    state = {
        menuCollapse: false,
        loggedInUserName: "Guest",
        loggedInUserRole: "User",
        selected: "Home",
        sidebarTextSelectedColor: "yellow",
        sidebarTextColor: "white",
        preferences: {},
        usersPerPage: '20',
        customersPerPage: '20',
        availableTasksPerPage: '20',
        taskListsPerPage: '20',
        myTasksPerPage: '20',
        auditsPerPage: '20',
        announcementsPerPage: '20',
        sentAnnouncementsPerPage: '20',
        sidebarTextColorForUpdate: "white",
        sidebarTextSelectedColorForUpdate: "yellow",
        preferencesLoading: false,
        loading: false,
    };

    async componentDidMount() {
        this.setState({ loading: true })
        await this.getLoggedInUsername()
        await this.getLoggedInUserRole()
        await this.populateUserPreferences()
        await this.setSelected()
        this.setState({ loading: false })
    }

    getLoggedInUsername = async () => {
        const res = await axios.get("/getLoggedInUsername")
        this.setState({ loggedInUserName: res.data.loggedInUserName })
    }

    getLoggedInUserRole = async () => {
        const res = await axios.get(`${process.env.MIX_API_URL}/users/role`)
        this.setState({ loggedInUserRole: res.data.role })
    }

    populateUserPreferences = async () => {
        const res = await axios.get(`${process.env.MIX_API_URL}/preferences`);
        this.setState({
            preferences: res.data.userPreferences,
            sidebarTextColor: res.data.userPreferences.sidebarTextColor,
            sidebarTextSelectedColor: res.data.userPreferences.sidebarTextSelectedColor,
            sidebarTextColorForUpdate: res.data.userPreferences.sidebarTextColor,
            sidebarTextSelectedColorForUpdate: res.data.userPreferences.sidebarTextSelectedColor,
        })
    }

    setSelected = async () => {
        let currentURL = window.location.href;
        if (currentURL.includes("users")) {
            this.setState({ selected: "Users" })
        } else if (currentURL.includes("customers")) {
            this.setState({ selected: "Customers" })
        } else if (currentURL.includes("events")) {
            this.setState({ selected: "Events" })
        } else if (currentURL.includes("filemanager")) {
            this.setState({ selected: "Files" })
        } else if (currentURL.includes("availableTasks")) {
            this.setState({ selected: "Available Tasks" })
        } else if (currentURL.includes("taskLists")) {
            this.setState({ selected: "Task Lists" })
        } else if (currentURL.includes("mytasks")) {
            this.setState({ selected: "My Tasks" })
        } else if (currentURL.includes("announcementssent")) {
            this.setState({ selected: "Sent Announcments" })
        } else if (currentURL.includes("announcements")) {
            this.setState({ selected: "Announcments" })
        } else if (currentURL.includes("preferences")) {
            this.setState({ selected: "Preferences" })
        } else if (currentURL.includes("audits")) {
            this.setState({ selected: "Audits" })
        }
    }

    logout = async () => {
        await axios.post("/logout");
        window.location.href = "/"
    }

    changeColorOnClick = (selectedLink) => {
        this.setState({ selected: selectedLink })
    }

    handlePreferencesUpdate = async (event) => {
        event.preventDefault();
        const { usersPerPage, customersPerPage, availableTasksPerPage, taskListsPerPage, myTasksPerPage, auditsPerPage,
            announcementsPerPage, sentAnnouncementsPerPage, sidebarTextColorForUpdate, sidebarTextSelectedColorForUpdate } = this.state;
        this.setState({ preferencesLoading: true });
        const res = await axios.put(`${process.env.MIX_API_URL}/preferences/0`, {
            usersPerPage: usersPerPage,
            customersPerPage: customersPerPage,
            availableTasksPerPage: availableTasksPerPage,
            taskListsPerPage: taskListsPerPage,
            myTasksPerPage: myTasksPerPage,
            auditsPerPage: auditsPerPage,
            announcementsPerPage: announcementsPerPage,
            sentAnnouncementsPerPage: sentAnnouncementsPerPage,
            sidebarTextColor: sidebarTextColorForUpdate,
            sidebarTextSelectedColor: sidebarTextSelectedColorForUpdate
        });
        if (res.data.status === 200) {
            await this.populateUserPreferences();
            this.setState({ preferencesLoading: false });
        }
    };

    handlePreferencesSelectChange = (value, obj, field) => {
        switch (field) {
            case "users":
                this.setState({ usersPerPage: obj.value })
                break;
            case "customers":
                this.setState({ customersPerPage: obj.value })
                break;
            case "availableTasks":
                this.setState({ availableTasksPerPage: obj.value })
                break;
            case "tasks":
                this.setState({ taskListsPerPage: obj.value })
                break;
            case "mytasks":
                this.setState({ myTasksPerPage: obj.value })
                break;
            case "audits":
                this.setState({ auditsPerPage: obj.value })
                break;
            case "announcements":
                this.setState({ announcementsPerPage: obj.value })
                break;
            case "sentAnnouncements":
                this.setState({ sentAnnouncementsPerPage: obj.value })
                break;
            case "sidebarTextSelectedColor":
                this.setState({ sidebarTextSelectedColorForUpdate: obj.value })
                break;
            case "sidebarTextColor":
                this.setState({ sidebarTextColorForUpdate: obj.value })
                break;

            default:
        }
    }

    render() {
        const { menuCollapse, loggedInUserName, loggedInUserRole, selected, sidebarTextSelectedColor, sidebarTextColor, preferences, loading } = this.state;
        return (
            <div>
                {loading ? <Spinner text="loading..." /> : <div>
                    <button className="logoutButton" onClick={this.logout}>
                        Logout
                    </button>
                    <Router>
                        <button className="changePasswordButton">
                            <Link to="/userChangePassword">
                                <div style={{ color: "white", float: "left", marginLeft: "3px", paddingBottom: "3px" }} >
                                    Change Password
                                </div>
                            </Link>
                        </button>

                        <div id="sidebar" style={{ display: 'grid', gridTemplateColumns: '200px auto' }}>
                            <ProSidebar className='sideBar' collapsed={menuCollapse} image="/sidebar/background.jpg" style={{ backgroundColor: "white" }} >
                                <SidebarHeader className="sideBarHeader">
                                    <p className="clickable">{"EbackOffice"}{", " + loggedInUserName}</p>
                                </SidebarHeader>
                                <SidebarContent>
                                    <Menu iconShape="square">
                                        <MenuItem icon={<FaBattleNet />} onClick={() => { this.changeColorOnClick("Home") }}>
                                            <span style={{ color: selected === "Home" ? sidebarTextSelectedColor : sidebarTextColor }}>
                                                Home
                                            </span>
                                            <Link to="/" />
                                        </MenuItem>
                                        {loggedInUserRole === "admin" ? <MenuItem icon={<FaAdn />} onClick={() => { this.changeColorOnClick("Users") }}>
                                            <span style={{ color: selected === "Users" ? sidebarTextSelectedColor : sidebarTextColor }}>
                                                Users
                                            </span>
                                            <Link to="/users" />
                                        </MenuItem> : ""}
                                        <MenuItem icon={<FaArtstation />} onClick={() => { this.changeColorOnClick("Customers") }}>
                                            <span style={{ color: selected === "Customers" ? sidebarTextSelectedColor : sidebarTextColor }}>
                                                Customers
                                            </span>
                                            <Link to="/customers" />
                                        </MenuItem>
                                        <MenuItem icon={<FaFantasyFlightGames />} onClick={() => { this.changeColorOnClick("Events") }}>
                                            <span style={{ color: selected === "Events" ? sidebarTextSelectedColor : sidebarTextColor }}>
                                                Events
                                            </span>
                                            <Link to="/events" />
                                        </MenuItem>
                                        <MenuItem icon={<FaCriticalRole />} onClick={() => { this.changeColorOnClick("Files") }}>
                                            <span style={{ color: selected === "Files" ? sidebarTextSelectedColor : sidebarTextColor }}>
                                                File manager
                                            </span>
                                            <Link to="/filemanager" />
                                        </MenuItem>
                                        <SubMenu title="Task Settings" icon={<FaDrupal />} style={{ color: sidebarTextColor }}>
                                            <MenuItem icon={<FaFreebsd />} onClick={() => { this.changeColorOnClick("Available Tasks") }}>
                                                <span style={{ color: selected === "Available Tasks" ? sidebarTextSelectedColor : sidebarTextColor }}>
                                                    Available Tasks
                                                </span>
                                                <Link to="/availableTasks" />
                                            </MenuItem>
                                            <MenuItem icon={<FaGitter />} onClick={() => { this.changeColorOnClick("Task Lists") }}>
                                                <span style={{ color: selected === "Task Lists" ? sidebarTextSelectedColor : sidebarTextColor }}>
                                                    Task Lists
                                                </span>
                                                <Link to="/taskLists" />
                                            </MenuItem>
                                            <MenuItem icon={<FaGratipay />} onClick={() => { this.changeColorOnClick("My Tasks") }}>
                                                <span style={{ color: selected === "My Tasks" ? sidebarTextSelectedColor : sidebarTextColor }}>
                                                    My Tasks
                                                </span>
                                                <Link to="/mytasks" />
                                            </MenuItem>
                                        </SubMenu>
                                        <SubMenu title="Announcements" icon={<FaGem />} style={{ color: sidebarTextColor }}>
                                            <MenuItem icon={<FaGrav />} onClick={() => { this.changeColorOnClick("Announcments") }}>
                                                <span style={{ color: selected === "Announcments" ? sidebarTextSelectedColor : sidebarTextColor }}>
                                                    Announcments
                                                </span>
                                                <Link to="/announcements" />
                                            </MenuItem>
                                            <MenuItem icon={<FaGripfire />} onClick={() => { this.changeColorOnClick("Sent Announcments") }}>
                                                <span style={{ color: selected === "Sent Announcments" ? sidebarTextSelectedColor : sidebarTextColor }}>
                                                    Sent Announcments
                                                </span>
                                                <Link to="/announcementssent" />
                                            </MenuItem>
                                        </SubMenu>
                                        <MenuItem icon={<FaBalanceScale />} onClick={() => { this.changeColorOnClick("Preferences") }}>
                                            <span style={{ color: selected === "Preferences" ? sidebarTextSelectedColor : sidebarTextColor }}>
                                                Preferences
                                            </span>
                                            <Link to="/preferences" />
                                        </MenuItem>
                                        {loggedInUserRole === "admin" ? <MenuItem icon={<FaFire />} onClick={() => { this.changeColorOnClick("Audits") }}>
                                            <span style={{ color: selected === "Audits" ? sidebarTextSelectedColor : sidebarTextColor }}>
                                                Audits
                                            </span>
                                            <Link to="/audits" />
                                        </MenuItem> : ""}
                                    </Menu>
                                </SidebarContent>

                            </ProSidebar>
                            <div className="centerH">
                                <Switch>
                                    <Route exact path="/" render={(props) => <Home {...props} />} />

                                    <Route exact path="/userChangePassword" render={(props) => <UserChangePassword {...props} />} />

                                    <Route exact path="/customers" render={(props) => <CustomerIndex {...props} perPage={preferences.customersPerPage} />} />
                                    <Route exact path="/customers/create" render={(props) => <CustomerCreate {...props} />} />
                                    <Route exact path="/customers/:id/edit" render={(props) => <CustomerEdit {...props} />} />

                                    <Route exact path="/events" render={(props) => <Event {...props} />} />

                                    <Route exact path="/filemanager" render={(props) => <FileManager {...props} />} />

                                    <Route exact path="/availableTasks" render={(props) => <AvailableTaskIndex {...props} perPage={preferences.availableTasksPerPage} />} />
                                    <Route exact path="/availableTasks/create" render={(props) => <AvailableTaskCreate {...props} />} />
                                    <Route exact path="/availableTasks/:id/edit" render={(props) => <AvailableTaskEdit {...props} />} />

                                    <Route exact path="/taskLists" render={(props) => <TaskListIndex {...props} perPage={preferences.taskListsPerPage} />} />
                                    <Route exact path="/taskLists/create" render={(props) => <TaskListCreate {...props} />} />
                                    <Route exact path="/taskLists/:id/edit" render={(props) => <TaskListEdit {...props} />} />
                                    <Route exact path="/mytasks" render={(props) => <MyTaskIndex {...props} perPage={preferences.myTasksPerPage} />} />

                                    <Route exact path="/announcements" render={(props) => <AnnouncementIndex {...props} perPage={preferences.announcementsPerPage} />} />
                                    <Route exact path="/announcementssent" render={(props) => <SentAnnouncementsIndex {...props} perPage={preferences.sentAnnouncementsPerPage} />} />
                                    <Route exact path="/announcements/create" render={(props) => <AnnouncementCreate {...props} />} />
                                    <Route exact path="/announcements/:id/edit/:source" render={(props) => <AnnouncementEdit {...props} />} />
                                    {/* <Route exact path="/announcements/:id/readOrUnreadPage/:reading" render={(props) => <ReadPage {...props} />} /> */}

                                    <Route exact path="/preferences"
                                        render={(props) => <PreferenceEdit
                                            handleUpdate={this.handlePreferencesUpdate}
                                            handleSelectChange={this.handlePreferencesSelectChange}
                                            usersPerPage={preferences.usersPerPage}
                                            customersPerPage={preferences.customersPerPage}
                                            availableTasksPerPage={preferences.availableTasksPerPage}
                                            taskListsPerPage={preferences.taskListsPerPage}
                                            myTasksPerPage={preferences.myTasksPerPage}
                                            auditsPerPage={preferences.auditsPerPage}
                                            announcementsPerPage={preferences.announcementsPerPage}
                                            sentAnnouncementsPerPage={preferences.sentAnnouncementsPerPage}
                                            sidebarTextColor={preferences.sidebarTextColor}
                                            sidebarTextSelectedColor={preferences.sidebarTextSelectedColor}
                                            loading={this.state.preferencesLoading}
                                            {...props} />}
                                    />

                                    {loggedInUserRole === "admin" && <React.Fragment>
                                        <Route exact path="/audits" render={(props) => <AuditIndex {...props} perPage={preferences.auditsPerPage} />} />
                                        <Route exact path="/audits/:id/edit" render={(props) => <AuditEdit {...props} />} />
                                        <Route exact path="/users" render={(props) => <UserIndex {...props} perPage={preferences.usersPerPage} />} />
                                        <Route exact path="/users/create" render={(props) => <UserCreate {...props} />} />
                                        <Route exact path="/users/:id/edit" render={(props) => <UserEdit {...props} />} />
                                    </React.Fragment>}

                                    <Route path="/" render={(props) => <Home {...props} />} />
                                </Switch>
                            </div>
                        </div>
                    </Router>
                </div>}
            </div>
        );
    }
}

export default Sidebar;
