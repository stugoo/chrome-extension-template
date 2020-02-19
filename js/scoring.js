
    const questions = [
      { name:'Recency', score: { high: 10, medium: 5, low: 1, unknown: NaN} },
      { name:'Reach', score: { high: 5, medium: 3, low: 0, unknown: NaN} },
      { name:'Impact', score: { high: 5, medium: 3, low: 1, unknown: NaN} },
      { name:'Confidence', score: { high: 1, medium: 0.8, low: 0.5, unknown: NaN} },
      { name:'Effort', score: { high: 3, medium: 2, low:1 , unknown: NaN} },
    ];

    const questionOptions = [ 'Unknown', 'High', 'Medium', 'Low'];
    const resultsData = {
      recency: NaN,
      reach: NaN,
      impact: NaN,
      confidence: NaN,
      effort: NaN,
    };

    const unknownMessage = 'Unknown';
    let scoreContainer,
        scoringForm,
        scoreDisplay,
        priorityDisplay,
        currentScore = unknownMessage,
        currentPriority = unknownMessage;

    const getScoringControls = question => {
      const controls = [];
      let value;
      questionOptions.forEach((option, i) => {
        value = question.score[option.toLowerCase()];
        controls.push(optionTemplate(option, question.name, value, i))
      });

      return controls.join('');
    }


    const questionTemplate = (question) => {
      const controls = getScoringControls(question);

      return `
        <div class="fa-form__row">
          <div class="fa-form__legend">${question.name}</div>
          <div class="fa-form__options">
          ${controls}
          </div>
        </div>
      `
    };

    const optionTemplate = (label, name, value, index) => `
      <div class="fa-form__item">
        <input type="radio"
          id="${name.toLowerCase()}-${label.toLowerCase()}"
          name="${name.toLowerCase()}"
          class="fa-form__control"
          value="${value}"
          ${index === 0 ? 'checked=checked' : ''}"
        />
        <label class="fa-form__label" for="${name.toLowerCase()}-${label.toLowerCase()}">
          ${label}
    </label>
      </div>
    `

    const drawQuestions = () => {
      const filter = [];
      questions.forEach(question => {
        filter.push(questionTemplate(question));
      });

      return filter.join('');
    }

    const drawResultArea = () => `
      <dl class="fa-results">
        <div class="fa-results__item">
          <dt class="fa-results__key">Score</dt>
            <dt class="fa-results__value" data-show-score>${currentScore}</dt>
        </div>
        <div class="fa-results__item">
          <dt class="fa-results__key">Fix</dt>
            <dt class="fa-results__value" data-show-priority>${currentPriority}</dt>
        </div>
      </dl>`;

    const setNewScore = selectedRadio => {
      const name = selectedRadio.name;
      const value = parseInt(selectedRadio.value, 10);
      resultsData[name] = value;

      updateScore();
    }

    const setScore = () => {
      const recencyScore = resultsData.recency;
      const reachScore = resultsData.reach;
      const impactScore = resultsData.impact;
      const confidenceScore = resultsData.confidence;
      const effortScore = resultsData.effort;
      const calculatedScore = recencyScore * reachScore * impactScore * confidenceScore / effortScore;
      currentScore = isNaN(calculatedScore) ? unknownMessage : calculatedScore;
    }

    const setPriority = () => {
      if (currentScore > 10) {
        currentPriority = "Fix Now";
      } else if (currentScore < 1) {
        currentPriority = "Fix Never";
      } else if (!isNaN(currentScore)) {
        currentPriority = "Fix Later";
      } else {
        currentPriority = unknownMessage;
      }
    }

    const updateScore = () => {
      setScore();
      setPriority();

      scoreDisplay.innerHTML = currentScore;
      priorityDisplay.innerHTML = currentPriority;

    }

    const postResults = (e) => {
      e.preventDefault();

      var result = "Recency " + resultsData.recency + "\n" +
      "Reach " + resultsData.reach + "\n" +
      "Impact " + resultsData.impact + "\n" +
      "Confidence " + resultsData.confidence + "\n" +
      "Effort " + resultsData.effort + "\n" +
      "\nScore " + currentScore + "\n" +
      "Fix: " + currentPriority;

      const commentField = document.getElementById('new_comment_field');
      commentField.value = result;

      const button = document.querySelector('#partial-new-comment-form-actions button.btn-primary');
      button.disabled = false;
    }

    const bindEvents = () => {
      scoreContainer.addEventListener('change', event => {
        const target = event.target;
        setNewScore(target);
      });

      scoreContainer.addEventListener('submit', postResults)
    }

    const createView = () => {
    //   const scoringContainer = document.querySelector('.fa-issue-scoring');

    //   if(scoringContainer === null) {
    //     document.body.innerHTML += '<div class="fa-issue-scoring"></div>';
    //   }

    //   const questionContainer = document.querySelector('.fa-issue-scoring');
    //   const questions = drawQuestions();
    //   const results = drawResultArea();

    //   questionContainer.innerHTML = `
    //       <form class="fa-form">
    //         ${questions + results}
    //         <button class="fa-form__button">Post Score</button>
    //       </form>
    //   `;

      scoreContainer = document.querySelector('.fa-issue-scoring');
      scoringForm = scoreContainer.querySelector('.fa-form');
      scoreDisplay = document.querySelector('[data-show-score]');
      priorityDisplay = document.querySelector('[data-show-priority]');
      bindEvents();

    }

    createView();


