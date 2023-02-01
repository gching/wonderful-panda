import {useCallback, useEffect, useState} from 'react'
import heartIcon from './assets/heart-icon.svg';
import './App.css'
import HeartIcon from "./HeartIcon";

const USER_ID = '1'
const GROUP_LIKE_ID = '2'

const getLikeCount = async (id: string): Promise<number> => {
    const resp = await fetch(`http://localhost:3001/api/v1/like/${id}/count`)

    if (!resp.ok) {
        throw new Error('Response failure');
    }

    const respBody: {data: number} = await resp.json();

    return respBody.data;
}

const getIsLiked = async (id: string, userId: string): Promise<boolean> => {
    const resp = await fetch(`http://localhost:3001/api/v1/like/${id}/user/${userId}`)

    if (!resp.ok) {
        throw new Error('Response failure');
    }

    const respBody: {data: boolean} = await resp.json();

    return respBody.data;
}

const updateLikeDislike = async (id:string, userId: string, isLike: boolean) => {
    const resp = await fetch(`http://localhost:3001/api/v1/like/${isLike ? 'add' : 'remove'}`, {
        method: 'POST',
        body: JSON.stringify({likeId: id, userId,})
    });

    if (!resp.ok) {
        throw new Error('Response failure');
    }
}

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

function App() {
    const [likeCount, setLikeCount] = useState<number | null>(null);
    const [isLiked, setIsLiked] = useState<boolean | null>(null);

    useEffect(() => {
        let isMounted = true;
        getLikeCount(GROUP_LIKE_ID)
            .then((count) => {
                isMounted && setLikeCount(count)
            })
            .catch((e) => {
                // Empty catch
            });

        getIsLiked(GROUP_LIKE_ID, USER_ID)
            .then((isLiked) => {
                    isMounted && setIsLiked(isLiked);
            })
            .catch((e) => {
                // Empty catch
            });

        return () => {
            isMounted = false;
        }
    }, [])

    const handleOnClick = useCallback(() => {
        if (isLiked == null) {
            return;
        }

        updateLikeDislike(GROUP_LIKE_ID, USER_ID, !isLiked).then(() => {
            setIsLiked(!isLiked);
            setLikeCount((prev) => {
                if (prev == null) {
                    return 0;
                }

                return isLiked ? prev - 1 : prev + 1
            })
        });


    }, [isLiked])

    const formattedCount = likeCount != null ? formatter.format(likeCount) : 0;
    const pressed = isLiked == null ? undefined : isLiked ? 'true' : 'false'

    return (
        <div className="App">
          <button aria-pressed={pressed} onClick={likeCount != null && isLiked != null ? handleOnClick : undefined}>
              <HeartIcon fill={isLiked ? "red" : undefined}/>
              <h1>{formattedCount}</h1>
          </button>
        </div>
    )
}

export default App
