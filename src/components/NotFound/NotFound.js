import { Spacer, Text, Link as LinkNextUI } from '@nextui-org/react';
import classes from './NotFound.module.css';
import { Button } from '@nextui-org/react';
import { MdKeyboardBackspace } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className={classes.main}>
            <Text h1 size={100}>
                404
            </Text>
            <Text h2 size={30} weight={'light'}>
                Page not found
            </Text>
            <Spacer />
            <Text size={25} weight={'light'} css={{ textAlign: 'center' }}>
                If you think this is a mistake, please contact the
                administrator.
            </Text>
            <Button
                auto
                color={'default'}
                style={{ marginTop: '20px' }}
                icon={<MdKeyboardBackspace />}
                onPress={() => navigate('/')}
            >
                Back To Home
            </Button>
            <Spacer y={3} />
            <Text size={17}>
                Modded © {new Date().getFullYear()}{' '}
                <LinkNextUI
                    target={'_blank'}
                    href="https://github.com/MinhDepTraiBoDoiQua"
                    color={'text'}
                >
                    <strong>MinhDepTraiBoDoiQua</strong>
                </LinkNextUI>
            </Text>
        </div>
    );
};

export default NotFound;
