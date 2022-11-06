import React, { FormEvent } from 'react';
import { Stack, Text, Link, FontWeights, IStackTokens, IStackStyles, ITextStyles, Pivot, PivotLinkFormat, TextField, PivotItem, initializeIcons, PrimaryButton, ActionButton, MessageBar, MessageBarType, IDropdownOption, Dropdown, Spinner } from '@fluentui/react';
import logo from './logo.svg';
initializeIcons();

const options: IDropdownOption[] = [
    //{ key: 'fruitsHeader', text: 'Fruits', itemType: DropdownMenuItemType.Header },
    { key: 'apple', text: 'Apple' },
    { key: 'banana', text: 'Banana' },
    { key: 'orange', text: 'Orange', disabled: true },
    { key: 'grape', text: 'Grape' },
    //{ key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
    //{ key: 'vegetablesHeader', text: 'Vegetables', itemType: DropdownMenuItemType.Header },
    { key: 'broccoli', text: 'Broccoli' },
    { key: 'carrot', text: 'Carrot' },
    { key: 'lettuce', text: 'Lettuce' },
];

interface IAddMatchState {
    isExpanded: boolean,
    showMessageBar: boolean,
    loading: boolean;
}

class AddMatch extends React.Component<{}, IAddMatchState> {

    private matchId: Number;

    private homeTeamScore: Number;

    private awayTeamScore: Number;

    private homeTeamsList: IDropdownOption[];

    private awayTeamsList: IDropdownOption[];

    private message: string;

    private messageBarType: MessageBarType;

    private homeTeamChoice: any;

    private awayTeamChoice: any;

    constructor(props: any) {
        super(props);
        this.state = {
            isExpanded: false,
            showMessageBar: false,
            loading: true
        }
        this.matchId = 0;
        this.homeTeamScore = 0;
        this.awayTeamScore = 0;
        this.message = '';
        this.messageBarType = MessageBarType.warning;
        this.homeTeamsList = [];
        this.awayTeamsList = [];
        this.homeTeamChoice = { id: '', name: '' };
        this.awayTeamChoice = { id: '', name: '' };
    }

    private addMatchtoServer = async () => {
        return new Promise((resolve, reject) => {
            var url = 'http://localhost:8080/league/addMatch/' + this.matchId + '/' + this.homeTeamChoice.id + '/' + this.homeTeamScore + '/' + this.awayTeamChoice.id + '/' + this.awayTeamScore;
            fetch(url, {
                method: "GET",
                // headers: {
                // 	"key" : "dict.1.1.20210216T114936Z.e4989dccd61b9626.373cddfbfb8a3b2ff30a03392b4e0b076f14cff9"
                // }
            }).then(function (response) {
                return response.json().then(function (responseJson) {
                    resolve(responseJson);
                });
            }).catch(function (err) {
                console.log('Fetch problem: ' + err.message);
                reject();
            });
        });
    }

    private submitButtonClicked = async (event: any) => {
        if ((this.matchId == 0) || (this.homeTeamScore < 0) || (this.awayTeamScore < 0)) {
            this.message = 'Enter positive or zero value for Match Id and Scores';
            this.messageBarType = MessageBarType.error;
            this.setState({ showMessageBar: true });
        } else if ((this.homeTeamChoice.id === '') || (this.awayTeamChoice.id === '')) {
            this.message = 'Select a value for club';
            this.messageBarType = MessageBarType.error;
            this.setState({ showMessageBar: true });
        } else {
            let message: any = await this.addMatchtoServer();
            if (message.matchId) { // succcess case
                this.message = 'Match ' + message.matchId + ' added Succesfully';
                this.messageBarType = MessageBarType.success;
                this.setState({ showMessageBar: true });
            }
        }
    }

    private addMatchButtonClicked = (event: any) => {
        if (!this.state.isExpanded) {
            this.setState({ isExpanded: true });
        } else {
            this.setState({ isExpanded: false });
        }
    }

    private textFieldChanged = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement> | any, newValue?: string | undefined) => {
        if (event.target.id == 'homeScoreField') {
            this.homeTeamScore = Number(newValue);
        } else if (event.target.id == 'awayScoreField') {
            this.awayTeamScore = Number(newValue);
        } else if (event.target.id == 'matchIdField') {
            this.matchId = Number(newValue);
        }
    }

    private dismissMessage = (event: any) => {
        this.message = '';
        this.messageBarType = MessageBarType.warning;
        this.setState({ showMessageBar: false });
    }

    private dropDownChanged = (item: any, value: any) => {
        if (item.target.id == 'homeTeamDropDownId') {
            this.homeTeamChoice.id = value.key;
            this.homeTeamChoice.name = value.text;
        } else if ((item.target.id == 'awayTeamDropDownId')) {
            this.awayTeamChoice.id = value.key;
            this.awayTeamChoice.name = value.text;
        }
    }

    render() {
        return (
            <>
                <PrimaryButton onClick={this.addMatchButtonClicked}>Add a Match Detail</PrimaryButton>
                {this.state.isExpanded &&
                    <Stack styles={{ root: { marginTop: '5%' } }}>
                        <Text styles={{ root: { fontWeight: 'bold' } }}>Enter Match Details</Text>
                        {!this.state.loading &&
                            <Stack tokens={{ childrenGap: 10 }}>
                                <TextField
                                    id="matchIdField"
                                    defaultValue='0'
                                    onChange={this.textFieldChanged}
                                    type="Number"
                                    required
                                    label="Match Id">
                                </TextField>
                                <Dropdown
                                    id="homeTeamDropDownId"
                                    placeholder="Select Home Team"
                                    label="Home Team"
                                    options={this.homeTeamsList}
                                    onChange={this.dropDownChanged}
                                    defaultSelectedKey={this.homeTeamChoice.id}
                                //styles={dropdownStyles}
                                />
                                <TextField
                                    id="homeScoreField"
                                    defaultValue='0'
                                    onChange={this.textFieldChanged}
                                    type="Number"
                                    required
                                    label="Home Team Score">
                                </TextField>
                                <Dropdown
                                    id="awayTeamDropDownId"
                                    placeholder="Select Away Team"
                                    label="Away Team"
                                    options={this.awayTeamsList}
                                    onChange={this.dropDownChanged}
                                    defaultSelectedKey={this.awayTeamChoice.id}
                                //styles={dropdownStyles}
                                />
                                <TextField
                                    id="awayScoreField"
                                    defaultValue='0'
                                    onChange={this.textFieldChanged}
                                    required
                                    type="Number"
                                    label="Away Team Score">
                                </TextField>
                                <ActionButton
                                    iconProps={{ iconName: 'Add' }}
                                    allowDisabledFocus
                                    onClick={this.submitButtonClicked}
                                >
                                    Submit Match Details
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
                        }
                        {this.state.loading &&
                            <><Spinner label='Loading Teams. Please wait...!'></Spinner></>
                        }
                    </Stack>

                }
            </>
        )
    }

    private getTeamsDataFromServer = () => {
        return new Promise((resolve, reject) => {
            var url = 'http://localhost:8080/league/teams';
            fetch(url, {
                method: "GET",
                // headers: {
                // 	"key" : "dict.1.1.20210216T114936Z.e4989dccd61b9626.373cddfbfb8a3b2ff30a03392b4e0b076f14cff9"
                // }
            }).then(function (response) {
                return response.json().then(function (responseJson) {
                    resolve(responseJson);
                });
            }).catch(function (err) {
                console.log('Fetch problem: ' + err.message);
                reject();
            });
        });


    }

    private createHomeAndAwayTeamsList = (teamsList: any) => {
        for (let team of teamsList) {
            let tempHomeTeam: IDropdownOption = { key: '', text: '' };
            let awayHomeTeam: IDropdownOption = { key: '', text: '' };
            tempHomeTeam.key = team.id;
            tempHomeTeam.text = team.teamName;
            awayHomeTeam.key = team.id;
            awayHomeTeam.text = team.teamName;
            this.homeTeamsList.push(tempHomeTeam);
            this.awayTeamsList.push(tempHomeTeam);
        }

    }

    async componentDidMount() {
        let teamsList = await this.getTeamsDataFromServer();
        this.createHomeAndAwayTeamsList(teamsList);
        this.setState({ loading: false });

    }

}

export default AddMatch;