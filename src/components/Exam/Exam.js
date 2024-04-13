import { Fragment, useEffect, useState } from 'react';
import classes from './Exam.module.css';
import flagExam from '../../images/flag-exam.png';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Modal, Text, Progress, Table } from '@nextui-org/react';
import ReactGA from 'react-ga4';

const dummyTable = [
    ['Machine', 'MinhDevTree-Machine'],
    ['Server', 'MinhDevTree-Server'],
    ['Duration', '60 minutes'],
    ['Q mark', '1'],
    ['Student', 'MinhDevTree'],
    ['Exam Code', '- - - - -'],
    ['Open Code', '- - - - -'],
    ['Total Mark', '30'],
];

const generateAnswer = question => {
    console.log('question ', question);
    const lastChoice = question.question
        .split('\n')
        [question.question.split('\n').length - 1].trim()
        .charAt(0)
        .toUpperCase();
    console.log('lastChoice ', lastChoice);
    const selectList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L'];
    let realList = [];
    for (let i = 0; i < selectList.length; i++) {
        if (selectList[i] !== lastChoice) {
            realList.push(selectList[i]);
        } else {
            realList.push(selectList[i]);
            break;
        }
    }

    return realList;
};

const getRamdom = (id, quantity) => {
    dummyTable[5][1] = localStorage.getItem(id)
        ? JSON.parse(localStorage.getItem(id)).name.replaceAll(' ', '_')
        : '- - - - -';
    const arrayQuestion = JSON.parse(localStorage.getItem(id))
        .data.map(item => {
            item.answer = item.answer.trim().charAt(0).toUpperCase();
            item.choose = undefined;
            return item;
        })
        .filter(item => item.answer.length === 1);
    return arrayQuestion
        .sort(() => Math.random() - 0.5)
        .slice(0, quantity ? quantity : 30);
};

const getSeconds = (id, quantity) => {
    const maxNumberQuestion = JSON.parse(localStorage.getItem(id)).data.length;

    return maxNumberQuestion < quantity
        ? maxNumberQuestion * 45
        : quantity * 45;
};

const Exam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [listQuestion, setListQuestion] = useState(
        getRamdom(id, location.state.quantity)
    );
    const [indexQuestion, setIndexQuestion] = useState(0);
    const [enableSubmit, setEnableSubmit] = useState(false);
    const [time, setTime] = useState(getSeconds(id, location.state.quantity));

    dummyTable[2][1] =
        Math.floor(getSeconds(id, location.state.quantity) / 60) +
        ' minutes' +
        ' ' +
        (getSeconds(id, location.state.quantity) -
            Math.floor(getSeconds(id, location.state.quantity) / 60) * 60) +
        ' seconds';
    dummyTable[7][1] = location.state.quantity ? location.state.quantity : 30;

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const a = setTimeout(() => {
            if (time > 0) {
                setTime(time - 1);
            } else {
                setShowModal(true);
            }
        }, 1000);
        return () => clearTimeout(a);
    }, [time]);

    useEffect(() => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            /* IE/Edge */
            elem.msRequestFullscreen();
        }

        ReactGA.event({
            category: 'Exam',
            action: 'Take a exam' + JSON.parse(localStorage.getItem(id))?.name,
        });

        return () => {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                /* IE11 */
                document.msExitFullscreen();
            }
        };
    }, []);

    const handleAnswer = e => {
        if (listQuestion[indexQuestion].choose === e) {
            listQuestion[indexQuestion].choose = undefined;
        } else {
            listQuestion[indexQuestion].choose = e;
        }
        setListQuestion([...listQuestion]);
    };

    const handleNext = () => {
        if (indexQuestion < listQuestion.length - 1) {
            setIndexQuestion(indexQuestion + 1);
        } else {
            setIndexQuestion(0);
        }
    };

    const handleChangeQuestion = e => {
        setIndexQuestion(e);
    };

    const handleFinish = () => {
        setShowModal(true);
    };

    const handleCloseModel = () => {
        setTimeout(() => {
            navigate('/course/' + id);
        }, 250);
    };

    let munites = Math.floor(time / 60);
    if (munites < 10) {
        munites = '0' + munites;
    }
    let seconds = time % 60;
    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    return (
        <Fragment>
            <Modal
                closeButton
                aria-labelledby="modal-title"
                open={showModal}
                width={1200}
                onClose={handleCloseModel}
            >
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        <Text b size={18}>
                            Result Exam:{' '}
                            {
                                listQuestion.filter(
                                    item => item.choose === item.answer
                                ).length
                            }{' '}
                            / {listQuestion.length} (
                            {Math.round(
                                (listQuestion.filter(
                                    item => item.choose === item.answer
                                ).length /
                                    listQuestion.length) *
                                    1000
                            ) / 100}{' '}
                            / 10 )
                        </Text>
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <Table sticked>
                            <Table.Header>
                                <Table.Column width={'5%'}>No.</Table.Column>
                                <Table.Column>Question</Table.Column>
                                <Table.Column
                                    css={{ textAlign: 'center' }}
                                    width={'6%'}
                                >
                                    Answer
                                </Table.Column>
                                <Table.Column
                                    css={{ textAlign: 'center' }}
                                    width={'8%'}
                                >
                                    Your answer
                                </Table.Column>
                                <Table.Column></Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {listQuestion.map((item, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>
                                            <span
                                                className={classes.questionSpan}
                                            >
                                                {item.question}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell
                                            css={{ textAlign: 'center' }}
                                        >
                                            {item.answer}
                                        </Table.Cell>
                                        <Table.Cell
                                            css={{ textAlign: 'center' }}
                                        >
                                            {item.choose === undefined
                                                ? ' - '
                                                : item.choose}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div
                                                className={`${
                                                    item.answer === item.choose
                                                        ? classes.correct
                                                        : classes.incorrect
                                                }`}
                                            >
                                                {item.answer === item.choose
                                                    ? 'Correct'
                                                    : 'Incorrect'}
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                            <Table.Pagination
                                shadow
                                noMargin
                                align="center"
                                rowsPerPage={10}
                            />
                        </Table>
                    </div>
                    <Progress
                        size={'xs'}
                        value={
                            (listQuestion.filter(
                                item => item.choose === item.answer
                            ).length /
                                listQuestion.length) *
                            100
                        }
                        shadow
                        color="success"
                        status="success"
                    />
                </Modal.Body>
            </Modal>
            <div className={classes.main}>
                <div className={classes.header}>
                    <div className={classes.headerInformation}>
                        <div className={classes.headerFinish}>
                            <div>
                                <input
                                    id="submit"
                                    checked={enableSubmit}
                                    onChange={() => {
                                        setEnableSubmit(!enableSubmit);
                                    }}
                                    type={'checkbox'}
                                />
                                <label htmlFor={'submit'}>
                                    {' '}
                                    I want to finish the exam.
                                </label>
                            </div>
                            <button
                                disabled={!enableSubmit}
                                onClick={handleFinish}
                            >
                                Finish
                            </button>
                        </div>
                        <div className={classes.headerTable}>
                            <table>
                                <tbody>
                                    {dummyTable
                                        .slice(0, 4)
                                        .map(([key, value], index) => (
                                            <tr key={index}>
                                                <td
                                                    className={
                                                        classes.headerTableKey
                                                    }
                                                >
                                                    {key}:
                                                </td>
                                                <td
                                                    className={
                                                        classes.headerTableValue
                                                    }
                                                >
                                                    {value}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            <table>
                                <tbody>
                                    {dummyTable
                                        .slice(4, 8)
                                        .map(([key, value], index) => (
                                            <tr key={index}>
                                                <td
                                                    className={
                                                        classes.headerTableKey
                                                    }
                                                >
                                                    {key}:
                                                </td>
                                                <td
                                                    className={
                                                        classes.headerTableValue
                                                    }
                                                >
                                                    {value}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={classes.headerFontSize}>
                            <div>
                                <label htmlFor="font-family">Font:</label>
                                <input
                                    disabled
                                    value={'Microsoft Sans Serif'}
                                />
                            </div>
                            <div className={classes.headerSize}>
                                <label htmlFor="font-family">Size:</label>
                                <input disabled value={'10'} />
                            </div>
                        </div>
                    </div>
                    <div className={classes.headerTimeFlag}>
                        <img width={160} src={flagExam} />
                        <div>
                            {munites}:{seconds}
                        </div>
                    </div>
                </div>
                <div className={classes.tempBody}>
                    <div className={classes.body}>
                        <div className={classes.bodyAnswer}>
                            <div className={classes.bodyAnswerTitle}>
                                <strong>Answer</strong>
                            </div>
                            <table className={classes.bodyAnswerTable}>
                                <tbody>
                                    {generateAnswer(
                                        listQuestion[indexQuestion]
                                    ).map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    className={
                                                        classes.bodyAnswerCheckbox
                                                    }
                                                    type={'checkbox'}
                                                    id={'ans-' + index}
                                                    onChange={e => {
                                                        handleAnswer(item);
                                                    }}
                                                    checked={
                                                        item ===
                                                        listQuestion[
                                                            indexQuestion
                                                        ].choose
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <label
                                                    className={
                                                        classes.bodyAnswerLabel
                                                    }
                                                    htmlFor={'ans-' + index}
                                                >
                                                    {item}
                                                </label>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className={classes.bodyAnswerbuttonNext}>
                                <button onClick={handleNext}>Next</button>
                            </div>
                        </div>
                        <div className={classes.bodyQuestion}>
                            <div className={classes.bodyQuestionNumber}>
                                <strong>
                                    Multiple choices {indexQuestion + 1}/
                                    {listQuestion.length}
                                </strong>
                            </div>
                            <div className={classes.bodyQuestionContent}>
                                <div style={{ fontWeight: 'bold' }}>
                                    {listQuestion[indexQuestion].question.slice(
                                        0,
                                        listQuestion[
                                            indexQuestion
                                        ].question.indexOf('\n')
                                    )}
                                </div>
                                <div>
                                    {listQuestion[indexQuestion].question.slice(
                                        listQuestion[
                                            indexQuestion
                                        ].question.indexOf('\n')
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.footer}>
                    <div className={classes.footerButtons}>
                        {listQuestion.map((question, index) => (
                            <button
                                onClick={() => {
                                    handleChangeQuestion(index);
                                }}
                                className={`${
                                    question.choose !== undefined
                                        ? classes.buttonGreen
                                        : ''
                                }`}
                                key={index}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <div className={classes.footerExit}>
                        <div className={classes.footerFinish}>
                            <div>
                                <input
                                    id="submit-footer"
                                    checked={enableSubmit}
                                    onChange={() => {
                                        setEnableSubmit(!enableSubmit);
                                    }}
                                    type={'checkbox'}
                                />
                                <label htmlFor={'submit-footer'}>
                                    {' '}
                                    I want to finish the exam.
                                </label>
                            </div>
                            <button
                                disabled={!enableSubmit}
                                onClick={handleFinish}
                            >
                                Finish
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    navigate('/course/' + id);
                                }}
                            >
                                Exit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Exam;
