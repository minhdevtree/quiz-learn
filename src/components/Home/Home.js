import {
    Text,
    Spacer,
    Dropdown,
    Table,
    Tooltip,
    Progress,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './Home.module.css';
import { FcCollect, FcFile } from 'react-icons/fc';
import { HiOutlineEye } from 'react-icons/hi';

const Home = () => {
    const [listCourse, setListCourse] = useState([]);

    const navigate = useNavigate();

    const getData = () => {
        const array = Object.keys(localStorage).map(key => {
            return { id: key, data: JSON.parse(localStorage.getItem(key)) };
        });
        // sort by name
        const t = array.sort((a, b) => {
            return a.data.name.localeCompare(b.data.name);
        });
        setListCourse(t);
    };

    useEffect(() => {
        getData();
    }, []);

    const handleCreate = () => {
        navigate('/create');
    };

    useEffect(() => {
        const interval = setInterval(() => {
            getData();
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className={classes.header}>
                <Text h1>Home</Text>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        columnGap: '1rem',
                    }}
                >
                    <Dropdown disableAnimation>
                        <Dropdown.Button flat color="secondary">
                            Menu
                        </Dropdown.Button>
                        <Dropdown.Menu
                            color="secondary"
                            aria-label="Actions"
                            css={{ $$dropdownMenuWidth: '280px' }}
                            onAction={e => {
                                switch (e) {
                                    case 'quizlet':
                                        handleCreate();
                                        break;
                                    case 'merge':
                                        navigate('/merge');
                                        break;

                                    default:
                                        break;
                                }
                            }}
                        >
                            <Dropdown.Section title="Menu">
                                <Dropdown.Item
                                    key="quizlet"
                                    description="Create course by export Quizlet"
                                    color="primary"
                                    icon={<FcFile />}
                                >
                                    Quizlet
                                </Dropdown.Item>
                                <Dropdown.Item
                                    key="merge"
                                    description="Merge course for easy learning"
                                    color="success"
                                    icon={<FcCollect />}
                                >
                                    Merge course
                                </Dropdown.Item>
                            </Dropdown.Section>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <Spacer y={1.4} />
            <Text
                p="true"
                b
                size={16}
                css={{
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                List courses
            </Text>
            <Spacer />
            {listCourse.length > 0 && (
                <Table>
                    <Table.Header>
                        <Table.Column>Quiz name</Table.Column>
                        <Table.Column>Quantity</Table.Column>
                        <Table.Column>Progress</Table.Column>
                        <Table.Column width={190}>Create at</Table.Column>
                        <Table.Column width={40} align={'end'}></Table.Column>
                    </Table.Header>
                    <Table.Pagination
                        shadow
                        noMargin
                        align="center"
                        rowsPerPage={10}
                    />
                    <Table.Body>
                        {listCourse
                            .sort((a, b) => {
                                return (
                                    new Date(b.data.createdAt) -
                                    new Date(a.data.createdAt)
                                );
                            })
                            .map(item => {
                                const progress = (
                                    (item.data.data.filter(item => {
                                        return item.learned;
                                    }).length *
                                        100) /
                                    item.data.data.length
                                ).toFixed(2);
                                return (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>
                                            {item.data.name}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {item.data.data.length}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text
                                                p="true"
                                                b
                                                color={
                                                    progress >= 90
                                                        ? 'success'
                                                        : progress > 0
                                                        ? 'warning'
                                                        : 'error'
                                                }
                                            >
                                                {progress} %
                                            </Text>
                                            <Progress
                                                size={'xs'}
                                                value={progress}
                                                color={
                                                    progress >= 90
                                                        ? 'success'
                                                        : progress > 0
                                                        ? 'warning'
                                                        : 'error'
                                                }
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            {new Date(
                                                item.data.createdAt
                                            ).toLocaleString()}
                                        </Table.Cell>
                                        <Table.Cell
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            <Tooltip content={'View detail'}>
                                                <HiOutlineEye
                                                    size={20}
                                                    color="#005FCC"
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => {
                                                        navigate(
                                                            `/course/${item.id}`
                                                        );
                                                    }}
                                                />
                                            </Tooltip>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                    </Table.Body>
                </Table>
            )}
        </div>
    );
};

export default Home;
