import React from 'react';
import { Stack, Text, Link, FontWeights, IStackTokens, IStackStyles, ITextStyles, Pivot, PivotLinkFormat, TextField, PivotItem, initializeIcons } from '@fluentui/react';
import logo from './logo.svg';
import './App.css';
import AddteamView from './Components/AddTeamView';
import AddMatch from './Components/AddMatch';
import ShowLeagueStats from './Components/ShowLeagueStats';
initializeIcons();

class HomePage extends React.Component<{},{}> {

    constructor(props: {} | Readonly<{}>) {
        super(props);
    }

    render() {
        return(
            <Stack verticalAlign="center">
                <Text styles={{ root : { marginTop : '5%' }}} variant="xxLarge">Welcome to Premier League</Text>
                <Stack
                    //horizontal
                    styles = {{ root : {marginTop : '5%' , flex : 'auto'}}}
                    tokens={{ childrenGap: 30 }}
                    horizontalAlign="center"
                    >
                    <Stack.Item>
                        <AddteamView></AddteamView>
                    </Stack.Item>
                    <Stack.Item>
                        <AddMatch></AddMatch>
                    </Stack.Item>
                    <Stack.Item>
                        <ShowLeagueStats></ShowLeagueStats>
                    </Stack.Item>     
                </Stack>
            </Stack>
        )
    }


}

export default HomePage;