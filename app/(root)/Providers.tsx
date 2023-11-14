"use client";
import { ThemeProvider } from "next-themes";
import { useState, useEffect, createContext, useReducer } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { fetchPosts, fetchPosts_ } from "@/lib/actions/thread.actions";
import { fetchQuestions } from "@/lib/actions/question.action";
// Create a client
const queryClient = new QueryClient()

const allData = new Array(25).fill(0).map((_val, i) => i + 1);
const perPage = 10;
const types = {
  start: "START",
  loaded: "LOADED",
  start_questions: "START_QUESTIONS",
  loaded_questions: "LOADED_QUESTIONS"
};
const reducer = (state :any, action :any) => {
  switch (action.type) {
    case types.start:
      return { ...state, loading: true };
    case types.loaded:
      return {
        ...state,
        loading: false,
        data: [...state.data, ...action.newData],
        more: action.newData.length === perPage,
        after: state.after + 1
      };
    case types.start_questions:
      return { ...state, loading: true };
    case types.loaded_questions:
      return {
        ...state,
        loading: false,
        questions: [...state.questions, ...action.newData],
        more: action.newData.length === perPage,
        after_questions: state.after_questions + 1
      };
    default:
      throw new Error("Don't understand action");
  }
};

export const MyContext = createContext<any>(null);

function MyProvider({ children }:any) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    more: true,
    data: [],
    questions: [],
    after: 1,
    after_questions: 1 // Add this line
  });
  const { loading, data, after, more, questions, after_questions} = state;
  const load = async (search: any) => {
    dispatch({ type: types.start });
    try {
      const {posts, } = await fetchPosts({
        userId:"",
        searchString:search,
        pageNumber:after,
      })
      dispatch({ type: types.loaded, newData: posts });
    } catch (error) {
      console.log(error)
    }
  };
  const loadQuestions = async (search: any) => {
    dispatch({ type: types.start_questions });
    try {
      const {questions, isNext} = await fetchQuestions({
        userId:"",
        searchString:search,
        pageNumber:after_questions,
      })
      // console.log(questions)
      dispatch({ type: types.loaded_questions, newData: questions });
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <MyContext.Provider value={{ loading, data, more, load, loadQuestions, questions}}>
      {children}
    </MyContext.Provider>
  );
}


export default function Providers({ children } :any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>; 
  }

  return (
    <QueryClientProvider client={queryClient}>
      <MyProvider>
        <ThemeProvider attribute="class">
          {children}
          </ThemeProvider>
      </MyProvider>
    </QueryClientProvider>
  ) 
}