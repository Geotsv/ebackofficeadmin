import React, { Component } from 'react';
import {
    Grid,
    Form,
    TextArea,
    Button,
    Header,
    Message,
} from "semantic-ui-react";
import SelectSearch from 'react-select-search';
import fuzzySearch from "../fuzzySearch";
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import TextareaAutosize from 'react-textarea-autosize';
import CredentialIndex from '../Credential/CredentialIndex';
class CustomerCreate extends Component {
    state = {
        code: "",
        name: "",
        service: "",
        serviceOther: "",
        businessAddress: "",
        mailingAddress: "",
        yearEnd: "",
        ein: "",
        companyGroup: "",
        contactPerson: "",
        otherContactPerson: "",
        email: "",
        fax: "",
        telephone: "",
        clientStatus: "",
        remark: "",
	    description: "",
        editorState: EditorState.createEmpty(),
        credentials: [["", "", "", "", ""]],
        errors: [],
        loading: false
    }

    handleChange = event => { this.setState({ [event.target.name]: event.target.value }); };

    handleEditorChange = (editorState) => {
        this.setState({ editorState }, () => {
            this.setState({
                description: draftToHtml(convertToRaw(editorState.getCurrentContent()))
            })
        });
    };


    uploadImageCallBack = async (file) => {
        let fileName = new Date(Date.now()).toISOString() + "_" + file.name
        fileName = fileName.replaceAll(":", "-")
        await this.uploadImage(fileName, file)
        let imagePath = `${process.env.MIX_BASE_URL}/storage/customerImages/${fileName}`;
        return new Promise(
            (resolve, reject) => {
                resolve({ data: { link: imagePath } });
            }
        );
    }

    uploadImage = async (fileName, imageFile) => {
        const data = new FormData()
        data.append('fileName', fileName)
        data.append('imageFile', imageFile)
        this.setState({ loading: true });
        const res = await axios.post(`${process.env.MIX_API_URL}/customers/saveImageFile`, data).catch((e) => {
            console.log(e);
        });
        if (res.data.status === 200) {
            this.setState({ loading: false });
        }
    }

    handleStore = async event => {
        event.preventDefault();
        const { code, name, service, serviceOther, businessAddress, mailingAddress, yearEnd, ein,
            companyGroup, contactPerson, otherContactPerson, email, fax, telephone, clientStatus, remark, description, credentials } = this.state;
        if (this.isFormValid(this.state)) {
            this.setState({ loading: true });
            const res = await axios.post(`${process.env.MIX_API_URL}/customers`, {
                code: code,
                name: name,
                service: service,
                service_other: serviceOther,
                business_address: businessAddress,
                mailing_address: mailingAddress,
                year_end: yearEnd,
                ein: ein,
                company_group: companyGroup,
                contact_person: contactPerson,
                other_contact_person: otherContactPerson,
                email: email,
                fax: fax,
                telephone: telephone,
                client_status: clientStatus,
                remark: remark,
		        description: description,
                credentials: credentials
            });
            if (res.data.status === 422) {
                this.setState({ loading: false });
                let validationErrors = res.data.errors;
                this.setState({ errors: [] }, () => {
                    const { errors } = this.state;
                    for (let key of Object.keys(validationErrors)) {
                        let errorArrayForOneField = validationErrors[key]
                        errorArrayForOneField.forEach(function (errorMessage, index) {
                            errors.push(errorMessage)
                        });
                    }
                    this.setState({ errors })
                });
            }
            else if (res.data.status === 200) {
                this.setState({ loading: false });
                this.props.history.push("/customers");
            }
        }
    };

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error}</p>);

    handleInputError = (errors, inputName) => {
        return errors.some(error => error.toLowerCase().includes(inputName)) ? "error" : "";
    };

    isFormValid = ({ code, name, service, description }) => {
        if (code && name && service && description ) { return true }
        this.setState({ errors: [] }, () => {
            const { errors } = this.state;
            if (code.length === 0) {
                errors.push("Code cannot be empty")
            }
            if (name.length === 0) {
                errors.push("Name cannot be empty")
            }
            if (service.length === 0) {
                errors.push("Service cannot be empty")
            }
            if (description .length === 0) {
                errors.push("Remark cannot be empty")
            }
            this.setState({ errors })
        });
    };

    handleMultipleSelectChange = (value, objArray, field) => {
        switch (field) {
            case "service":
                let service = "";
                for (let obj of objArray) {
                    service += obj.value + ", "
                }
                service = service.substring(0, service.length - 2); // remove last comma and space
                this.setState({ service })
            default:
        }
    }

    handleCredentialsChange = (e, inputType, index) => {
        const { credentials } = this.state;
        let credential = credentials[index];
        switch (inputType) {
            case "entityName":
                credential[0] = e.target.value;
                break
            case "loginUrl":
                credential[1] = e.target.value;
                break
            case "username":
                credential[2] = e.target.value;
                break
            case "password":
                credential[3] = e.target.value;
                break
            case "remarks":
                credential[4] = e.target.value;
                break
            default:
        }
        this.setState({ credentials })
    }

    addRow = (event) => {
        event.preventDefault();
        let { credentials } = this.state;
        credentials.push(["", "", "", "", ""])
        this.setState({ credentials })
    }

    deleteRow = (event, rowId) => {
        event.preventDefault();
        let { credentials } = this.state;
        credentials.splice(rowId, 1)
        this.setState({ credentials })
    }

    render() {
        const { code, name, service, serviceOther, businessAddress, mailingAddress, yearEnd, ein, companyGroup, contactPerson,
            otherContactPerson, email, fax, telephone, clientStatus, remark, editorState, credentials, errors, loading } = this.state;
        return (
            <div>
                <Header as="h1" icon color="blue" textAlign="center">
                    Create Customer
                </Header>
                <Form onSubmit={this.handleStore} size="small">
                    <Grid className="app">
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Form.Field>
                                    <label>Code</label>
                                    <Form.Input
                                        fluid
                                        name="code"
                                        onChange={this.handleChange}
                                        value={code}
                                        className={this.handleInputError(errors, "code")}
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Form.Field>
                                    <label>Name</label>
                                    <Form.Input
                                        fluid
                                        name="name"
                                        onChange={this.handleChange}
                                        value={name}
                                        className={this.handleInputError(errors, "name")}
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Form.Field className={this.handleInputError(errors, "service")}>
                                    <label>Service(s)</label>
                                    <SelectSearch
                                        search
                                        filterOptions={fuzzySearch}
                                        closeOnSelect={false}
                                        printOptions="on-focus"
                                        placeholder="Choose service(s)"
                                        multiple
                                        onChange={(value, objArray) => this.handleMultipleSelectChange(value, objArray, "service")}
                                        options={[
                                            { value: 'Tax', name: 'Tax' },
                                            { value: 'Accounting', name: 'Accounting' },
                                            { value: 'Other', name: 'Other' },
                                        ]}
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <label>Other service(s)</label>
                                <Form.Field>
                                    <Form.Input
                                        fluid
                                        name="serviceOther"
                                        onChange={this.handleChange}
                                        value={serviceOther}
                                        placeholder={"If other, please specify"}
                                        disabled={!service.includes("Other")}
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Form.Field>
                                    <label>Business Address</label>
                                    <TextArea
                                        name="businessAddress"
                                        onChange={this.handleChange}
                                        value={businessAddress}
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Form.Field>
                                    <label>Mailing Address</label>
                                    <TextArea
                                        name="mailingAddress"
                                        onChange={this.handleChange}
                                        value={mailingAddress}
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={6}>
                                <Form.Field>
                                    <label>Year End</label>
                                    <Form.Input
                                        fluid
                                        name="yearEnd"
                                        onChange={this.handleChange}
                                        value={yearEnd}
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <Form.Field>
                                    <label>Company EIN</label>
                                    <Form.Input
                                        fluid
                                        name="ein"
                                        onChange={this.handleChange}
                                        value={ein}
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <Form.Field>
                                    <label>CO. Group Name</label>
                                    <Form.Input
                                        fluid
                                        name="companyGroup"
                                        onChange={this.handleChange}
                                        value={companyGroup}
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={6}>
                                <Form.Field>
                                    <label>Primary Contact</label>
                                    <Form.Input
                                        fluid
                                        name="contactPerson"
                                        onChange={this.handleChange}
                                        value={contactPerson}
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <Form.Field>
                                    <label>Secondary Contact</label>
                                    <Form.Input
                                        fluid
                                        name="otherContactPerson"
                                        onChange={this.handleChange}
                                        value={otherContactPerson}
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <Form.Field>
                                    <label>Email</label>
                                    <Form.Input
                                        fluid
                                        name="email"
                                        onChange={this.handleChange}
                                        value={email}
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={6}>
                                <Form.Field>
                                    <label>Fax</label>
                                    <Form.Input
                                        fluid
                                        name="fax"
                                        onChange={this.handleChange}
                                        value={fax}
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <Form.Field>
                                    <label>Telephone</label>
                                    <Form.Input
                                        fluid
                                        name="telephone"
                                        onChange={this.handleChange}
                                        value={telephone}
                                    />
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <Form.Field>
                                    <label>Client Status</label>
                                    <Form.Input
                                        fluid
                                        name="clientStatus"
                                        onChange={this.handleChange}
                                        value={clientStatus}
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>

			<Grid.Row>
                            <Grid.Column width={16} >
				<Form.Field className={this.handleInputError(errors, "description")}>
                                    <label>Remark</label>
                                    <Editor
                                        editorStyle={{ height: "auto" }}
                                        editorState={editorState}
                                        wrapperClassName="demo-wrapper"
                                        editorClassName="editor-class"
                                        onEditorStateChange={this.handleEditorChange}
                                        toolbar={{
                                            image: {
                                                uploadCallback: this.uploadImageCallBack,
                                                previewImage: true,
                                                inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                                            }
                                        }}
                                    />
                                </Form.Field>	
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16} >
                                <CredentialIndex
                                    editable={true}
                                    addRow={this.addRow}
                                    deleteRow={this.deleteRow}
                                    handleCredentialsChange={this.handleCredentialsChange}
                                    credentials={credentials} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Button
                                    disabled={loading}
                                    className={loading ? "loading" : ""}
                                    color="blue"
                                    fluid
                                    size="large"
                                >
                                    Create customer
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form>
                <div style={{ marginTop: "20px" }}>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                </div>
            </div >
        );
    }
}

export default CustomerCreate;