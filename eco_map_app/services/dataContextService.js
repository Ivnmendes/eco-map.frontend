import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import { Alert } from 'react-native';
import { getAccessToken } from '../services/authService';

export function getCollectionType() {

}