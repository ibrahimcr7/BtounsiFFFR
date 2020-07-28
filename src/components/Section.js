import React, {Component} from 'react';
import Container from './Container';
import Arrow from './Arrow';
import rightArrow from '../images/icons/rightArrow.png';
import leftArrow from '../images/icons/leftArrow.png';
import styled from 'styled-components';
import Loading from './Loading';


const StyledSection = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
min-width: 300px;
max-width: 95%;
margin: 1em auto;
`



export default class Section extends Component{

    constructor(props) {
        super(props);
    
        this.state = {
            boxesNumber: 1,
            firstUpload: true,
            indexOfStartBox: 0,
            indexOfLastBox: 0,
            sectionShows: [],
            containerShows: []
        };
      }


    createBoxes = (width) =>{
        let boxWidth = parseInt(this.props.boxWidth.slice(0, 3));
        let factor = Math.floor(width / boxWidth);
        let boxesNumber = Math.floor(width / (boxWidth + factor*3)) || 1;
        if (this.state.firstUpload){
        this.setState({
            boxesNumber,
            firstUpload: false,
            indexOfLastBox: boxesNumber,
            sectionShows: this.props.sectionShows,
        }, () =>this.reCreateBoxes(this.state.indexOfStartBox, this.state.indexOfLastBox, this.state.sectionShows))
        } else {
            this.setState({
                boxesNumber,
                indexOfLastBox: this.state.indexOfStartBox + boxesNumber,
            }, () => this.reCreateBoxes(this.state.indexOfStartBox, this.state.indexOfLastBox, this.state.sectionShows))
        }
    }

    reCreateBoxes = (rightEdge, leftEdge, shows) => {
        // reduce given number to be inside the given interval
        function reduceNumber(number, interval){
            let reducedNumber = number % interval;
            if (reducedNumber < 0) return reducedNumber + interval
            return reducedNumber
        }
        // we give this function the right and left edges (indexes) of an array and it returns the wanted elements 
        function formatBoxesEdges(rightEdge, leftEdge, shows){
            let reducedRightEdge = reduceNumber(rightEdge, shows.length);
            let reducedLeftEdge = reduceNumber(leftEdge, shows.length);
            if (reducedRightEdge > reducedLeftEdge) return shows.slice(reducedRightEdge).concat(shows.slice(0, reducedLeftEdge))
            return shows.slice(reducedRightEdge, reducedLeftEdge)
        }
        this.setState({
            containerShows: formatBoxesEdges(rightEdge, leftEdge, shows)
        })
    }


    moveBoxesRight = () =>{
        this.setState({
            indexOfStartBox: this.state.indexOfStartBox + 1,
            indexOfLastBox: this.state.indexOfLastBox + 1
        }, () => this.reCreateBoxes(this.state.indexOfStartBox, this.state.indexOfLastBox, this.state.sectionShows))
    }

    moveBoxesLeft = () =>{
        this.setState({
            indexOfStartBox: this.state.indexOfStartBox - 1,
            indexOfLastBox: this.state.indexOfLastBox - 1
        }, () => this.reCreateBoxes(this.state.indexOfStartBox, this.state.indexOfLastBox, this.state.sectionShows))
    }
    
    render(){
        const {loading, arrowSize, containerMaxWidth, boxWidth, boxHeight, boxContentStyle} = this.props
        return (
            <>
                {loading ? <Loading /> : (
                    <StyledSection>
                        <Arrow 
                            moveBoxesFunction={this.moveBoxesLeft}  
                            arrowSize={arrowSize} 
                            imgURL={rightArrow}
                        />
                        <Container 
                            containerMaxWidth={containerMaxWidth} 
                            createBoxes={this.createBoxes} 
                            loading={loading} 
                            containerShows={this.state.containerShows} 
                            boxWidth={boxWidth} 
                            boxHeight={boxHeight}  
                            boxContentStyle={boxContentStyle}
                        />
                        <Arrow 
                            moveBoxesFunction={this.moveBoxesRight}  
                            arrowSize={arrowSize} 
                            imgURL={leftArrow}
                        />
                    </StyledSection>
                )}
            </>
        )
        }

}
