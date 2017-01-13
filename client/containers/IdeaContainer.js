import {connect} from 'react-redux';
import Idea from '../components/Idea.jsx';
import {makeGetIdea} from '../selectors/ideaSelectors';


// If the mapStateToProps argument supplied to connect returns a function instead of an object, 
// it will be used to create an individual mapStateToProps function for each instance of the container.
const makeMapStateToProps = () => {
    const getIdea = makeGetIdea()
    const mapStateToProps = (state, props) => {
        return {
            idea: getIdea(state, props)
        }
    }
    return mapStateToProps;
}

const IdeaContainer = connect(
  makeMapStateToProps
)(Idea)

export default IdeaContainer