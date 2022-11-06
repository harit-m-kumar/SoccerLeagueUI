import React from 'react';
import { Stack, Text, Link, FontWeights, IStackTokens, IStackStyles, ITextStyles, Pivot, PivotLinkFormat, TextField, PivotItem, initializeIcons, PrimaryButton, FocusZone, DetailsList, DetailsListLayoutMode, SelectionMode, Spinner } from '@fluentui/react';
import logo from './logo.svg';
initializeIcons();

const leagueStatsCollums: any[] = [
    { key: 'teamId', name: 'Team Id', fieldName: 'teamId', minWidth: 60, maxWidth: 100, isResizable: true, isSorted: false, isSortedDescending: false },
    { key: 'teamName', name: 'Team Name', fieldName: 'teamName', minWidth: 60, maxWidth: 100, isResizable: true, isSorted: false, isSortedDescending: false },
    { key: 'teamScore', name: 'Team Score', fieldName: 'teamScore', minWidth: 60, maxWidth: 100, isResizable: true, isSorted: false, isSortedDescending: false }
]

// const leagueItems: any[] = [
//     { key: 'brc', teamId: 1543, teamName: 'Barcelona', teamScore: 3 },
//     { key: 'rlm', teamId: 1571, teamName: 'Real Madrid', teamScore: 6 },
//     { key: 'cls', teamId: 2134, teamName: 'Chelsea', teamScore: 1 }
// ];

interface IShowLeagueStats {
    isExpanded: boolean,
    isLoading: boolean
}

class ShowLeagueStats extends React.Component<{}, IShowLeagueStats> {

    private leagueItems: any[];

    constructor(props: any) {
        super(props);
        this.state = {
            isExpanded: false,
            isLoading: false
        }
        this.leagueItems = [];
    }

    private createLeagueItems = async (response: any) => {
        for (let team of response) {
            let item = { key: '', teamId: 0, teamName: '', teamScore: 0 };
            item.key = team.idAsString;
            item.teamId = team.idAsString;
            item.teamName = team.teamName;
            item.teamScore = team.teamScore;
            this.leagueItems.push(item);
        }
        console.log("Done");
    }

    private getLeagueDataFromServer = () => {
        return new Promise((resolve, reject) => {
            var url = 'http://localhost:8080/league/statistics';
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

    private showButtonClicked = async (event: any) => {
        if (!this.state.isExpanded) { //if was collapsed
            this.setState({
                isExpanded: true,
                isLoading: true
            });
            let response = await this.getLeagueDataFromServer();
            await this.createLeagueItems(response);
            this.setState({ isLoading: false });
            console.log('fetched');
        } else {
            this.leagueItems = [];
            this.setState({
                isExpanded: false,
                isLoading: false
            });
        }
    }

    render() {
        return (
            <>
                <PrimaryButton onClick={this.showButtonClicked}>Show League Status</PrimaryButton>
                {this.state.isExpanded &&
                    //<div style={{ border: '1px solid', margin: '10%' }}>
                    <Stack styles={{ root: { marginTop: '5%' } }}>
                        <Text styles={{ root: { fontWeight: 'bold' } }}>League Score Board</Text>
                        {!this.state.isLoading &&
                            <FocusZone style={{ minWidth: '400px' }}>
                                <DetailsList
                                    columns={leagueStatsCollums}
                                    //columns={versionListCollumnList.filter((item) => {
                                    //return this.state.columnKeysToDisplay.indexOf(item.key) > -1;
                                    //})}
                                    items={this.leagueItems}
                                    setKey="set"
                                    styles={{
                                        root: {
                                            //backgroundColor: palette.neutralLight,
                                            marginTop: "10px",
                                        },
                                    }}
                                    layoutMode={DetailsListLayoutMode.justified}
                                    selectionMode={SelectionMode.none}
                                // onRenderDetailsHeader={this.renderVersionListHeader}
                                // onRenderItemColum={this.renderItemCollumns}
                                // onRenderDetailsHeader={this.renderHeader}
                                // onRenderRow={this.renderVersionRow2}
                                />
                            </FocusZone>
                        }
                        {this.state.isLoading &&
                            <Spinner label='My Spinner'></Spinner>
                        }
                    </Stack>
                }
            </>
        )
    }

}

export default ShowLeagueStats;