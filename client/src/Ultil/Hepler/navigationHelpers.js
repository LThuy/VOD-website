import { useNavigate } from 'react-router-dom';

export const useHandleClickFilmDetail = () => {
    const navigate = useNavigate();

    const handleClickFilmDetail = (slug) => {
        navigate(`/filmDetail/${slug}`);
    };

    return handleClickFilmDetail;
};

export const useHandleCLickWatchFilm = () => {
    const navigate = useNavigate();

    const handleClickWatchFilm = (slug) => {
        navigate(`/watchFilm/${slug}`);
    };

    return handleClickWatchFilm;
};

export const useHandleEnterSearchFilm = () => {
    const navigate = useNavigate();

    const handleClickSearchFilm = (slug) => {
        navigate(`/searchFilm/${slug}`);
    };

    return handleClickSearchFilm;
};
