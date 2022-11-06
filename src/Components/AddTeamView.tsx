import React, { FormEvent } from 'react';
import { Stack, Text, Link, FontWeights, IStackTokens, IStackStyles, ITextStyles, Pivot, PivotLinkFormat, TextField, PivotItem, initializeIcons, PrimaryButton, IconButton, ActionButton, MessageBarType, MessageBar } from '@fluentui/react';
import logo from './logo.svg';
initializeIcons();

interface IAddTeamState {
    isExpanded: boolean,
    showMessageBar: boolean,
}

class AddteamView extends React.Component<{}, IAddTeamState> {
    
    private teamId: Number | undefined | any;

    private teamName: string| undefined | any;

    private message: String;

    private messageBarType: MessageBarType;
    
    constructor(props: any) {
        super(props);
        this.state = {
            isExpanded: false,
            showMessageBar: false
        }
        this.teamId = 0;
        this.teamName = '';
        this.message = '';
        this.messageBarType = MessageBarType.warning;
    }

    private addTeamtoServer = async () => {
        return new Promise((resolve, reject) => {
            var url = 'http://localhost:8080/league/addTeam/' + this.teamId + '/' + this.teamName;
            fetch(url, {
                method: "GET",
            // headers: {
            // 	"key" : "dict.1.1.20210216T114936Z.e4989dccd61b9626.373cddfbfb8a3b2ff30a03392b4e0b076f14cff9"
            // }
        }).then(function(response) {
              return response.json().then(function(responseJson) {
                resolve(responseJson);
            });
          }).catch(function(err) {
            console.log('Fetch problem: ' + err.message);
            reject();
        });
      });
    }  

    private submitButtonClicked = async (event: any) => {
        if ((this.teamName == '') || (this.teamId == 0)) {
            this.message = 'Enter valid Parameters';
            this.messageBarType = MessageBarType.blocked
            this.setState({showMessageBar : true});
        } else {
            let message : any = await this.addTeamtoServer();
            if (message.teamName) { // succcess case
                this.message = message.teamName + ' added Succesfully';
                this.messageBarType = MessageBarType.success;
                this.setState({showMessageBar : true});
            }
            console.log('added');
        }
    }


    private addTeamButtonClicked = (event: any) => {
        if (!this.state.isExpanded) {
            this.setState({ isExpanded: true });
        } else {
            this.setState({ isExpanded: false });
        }
    }

    private textFieldChanged = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement > | any, newValue?: string | undefined) => {
        console.log('here');
        if (event.target.id == 'teamIdField') {
            this.teamId = newValue;
        } else if (event.target.id == 'teamNameField') {
            this.teamName = newValue;
        }
    }

    private dismissMessage = (event : any) => {
        this.message = '';
        this.messageBarType = MessageBarType.warning;
        this.setState({ showMessageBar : false});
    }

    render() {
        return (
            <>
                <PrimaryButton onClick={this.addTeamButtonClicked}>Add a New Team</PrimaryButton>
                {this.state.isExpanded &&
                    <Stack styles={{ root: { marginTop: '5%' } }}>
                        <Text styles={{ root: { fontWeight: 'bold' } }}>Enter Team Details</Text>
                        <Stack tokens={{ childrenGap: 10 }}>
                            <TextField
                                id="teamIdField" 
                                defaultValue='0'
                                onChange={this.textFieldChanged}
                                type="Number" required label="Team Id">
                            </TextField>
                            <TextField
                                id="teamNameField"  
                                onChange={this.textFieldChanged} required label="Team Name"></TextField>
                            <ActionButton 
                                iconProps={{ iconName : 'Add'}}
                                allowDisabledFocus
                                onClick={this.submitButtonClicked}
                            >
                                Submit Team Details
                            </ActionButton>
                            {this.state.showMessageBar &&
                                <MessageBar 
                                    messageBarType={this.messageBarType}
                                    onDismiss={this.dismissMessage}
                                >
                                    {this.message}
                                </MessageBar>
                            }
                        </Stack>
                    </Stack>

                }
            </>
        )
    }

}

export default AddteamView;