import { Accordion, AccordionDetails, AccordionSummary, Button, Card, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Toolbar, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Header from './shared/header.js'
import SearchIcon from '@material-ui/icons/Search';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import PageBody from './shared/pagebody.js';
import { withStyles } from '@material-ui/core/styles';
import { grey, red } from '@material-ui/core/colors';
import SearchBar from './shared/searchBar.js';
import axios from 'axios';


const styles = theme => ({
  searchField: {
    width: "75%",
  },
  searchToolbar: {
    gap: "20px",
    justifyContent: "center",
  },
  searchToolbarButton: {
    gap: "20px",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: "20px",
  },
  reportTypography: {
    margin: "20px",
  },
});


class Reports extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  handleSearch(searchText) {
    console.log(`Searching for ${searchText}`);
    axios.post(`http://${window.location.hostname}:8080/resume-report`, {queryString: searchText}).then(res => {
      console.log(res);
      this.setState({
        result: res.data,
      })
    })
  }

  render () {
    const { classes, userID } = this.props;
    const { result } = this.state;
    return (<>
      <Header selectedPage="Reports" userID={userID}/>
      <PageBody>
        <Card>
          <SearchBar 
            searchLabelText="Report Query"
            searchButtonText="Generate Report"
            handleSearch={searchText => this.handleSearch(searchText)}
          />
        </Card>
        {result && 
        <Card>
          <Toolbar className={classes.searchToolbar}>
            <Typography className={classes.reportTypography} variant="h5">Report</Typography>
          </Toolbar>
          
          <div className={classes.reportTypography}>
            {result.error ? 
              <Typography style={{color: red[500]}}>Error generating the report: {result.message}</Typography> 
            : 
            <>
              <Typography>There {result.employeeCount == 1 ? "is" : "are"} {result.employeeCount} employee{result.employeeCount == 1 ? "" : "s"} in the organization. {result.employeeCount == 1 ? "" : "Of those:"}</Typography>
              <Typography>{result.strictMatchCount} strictly match{result.strictMatchCount == 1 ? "es" : ""} the query ({(100.0 * result.strictMatchCount / result.employeeCount).toFixed(2)}% of the organization).</Typography>
              <Typography>{result.looseMatchCount} {result.looseMatchCount == 1 ? "has" : "have"} at least one skill in the query ({(100.0 * result.looseMatchCount / result.employeeCount).toFixed(2)}% of the organization).</Typography>
              {Object.entries(result.individualSkillMatches).map(([skill, count]) => <Typography>{count} {count == 1 ? "has" : "have"} the skill "{skill}" ({(100.0 * count / result.employeeCount).toFixed(2)}% of the organization).</Typography>)}
            </>}
          </div>
        </Card>
        }
      </PageBody>
    </>);
  }
}

export default withStyles(styles)(Reports);