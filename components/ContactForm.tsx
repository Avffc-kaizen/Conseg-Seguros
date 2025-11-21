import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { db, collection, addDoc, serverTimestamp, storage, ref, uploadBytes, getDownloadURL } from '../services/firebaseService';
import { LeadData } from '../types';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface ContactFormProps {
    initialProduct?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ initialProduct = '' }) => {
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [files, setFiles] = useState<FileList | null>(null);
    const [emailError, setEmailError] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    const [selectedProduct, setSelectedProduct] = useState(initialProduct);

    // Update internal state when prop changes to allow external triggers
    useEffect(() => {
        if (initialProduct) {
            setSelectedProduct(initialProduct);
        }
    }, [initialProduct]);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!formRef.current) return;
        const formData = new FormData(formRef.current);
        const email = formData.get('email') as string;

        if (!validateEmail(email)) {
            setEmailError('Por favor, insira um e-mail válido.');
            return;
        }
        setEmailError('');

        setStatus('uploading');

        try {
            // 1. Handle File Uploads
            const fileUrls: string[] = [];
            if (files && files.length > 0) {
                const userId = `guest_${Date.now()}`;
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (file.size > 5 * 1024 * 1024) continue; // Skip > 5MB

                    const storageRef = ref(storage, `uploads/${userId}/${Date.now()}_${file.name}`);
                    const snapshot = await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(snapshot.ref);
                    fileUrls.push(url);
                }
            }

            // 2. Prepare Data
            const leadData: LeadData = {
                nome: formData.get('nome') as string,
                email: email,
                telefone: formData.get('telefone') as string,
                produto: formData.get('produto') as string,
                mensagem: formData.get('mensagem') as string,
                anexos: fileUrls,
                createdAt: serverTimestamp(),
                page_url: window.location.href,
                content_name: 'Formulário de Contato',
            };

            // 3. Save to Firestore
            if (db) {
                await addDoc(collection(db, "leads-contato"), leadData);
            } else {
                console.warn("Firebase DB not available, logging data:", leadData);
            }

            setStatus('success');
            formRef.current.reset();
            setFiles(null);
            setSelectedProduct('');

        } catch (error) {
            console.error("Error submitting form:", error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="p-8 rounded-2xl bg-soft-blue border border-magic-blue/30 text-center animate-fade-in">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="w-16 h-16 text-magic-blue" />
                </div>
                <h3 className="font-orbitron text-2xl text-cosmic mb-2">Protocolo Iniciado</h3>
                <p className="text-slate-600">Sua solicitação foi encriptada e enviada. Um de nossos mentores estratégicos analisará seus dados e entrará em contato para o próximo nível.</p>
                <Button variant="secondary" className="mt-6" onClick={() => setStatus('idle')}>
                    Nova Solicitação
                </Button>
            </div>
        );
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="nome" className="block text-sm font-bold text-slate-700 font-orbitron">Nome Completo</label>
                    <input 
                        required 
                        type="text" 
                        name="nome" 
                        id="nome" 
                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-magic-blue focus:ring-2 focus:ring-magic-blue/20 outline-none transition-all"
                        placeholder="Seu nome ou da sua organização"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 font-orbitron">E-mail Estratégico</label>
                    <input 
                        required 
                        type="email" 
                        name="email" 
                        id="email" 
                        className={`w-full px-4 py-3 rounded-lg bg-slate-50 border ${emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-magic-blue focus:ring-magic-blue/20'} focus:ring-2 outline-none transition-all`}
                        placeholder="seu@email.com"
                        onChange={() => setEmailError('')}
                    />
                    {emailError && <p className="text-red-500 text-xs font-medium mt-1">{emailError}</p>}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="telefone" className="block text-sm font-bold text-slate-700 font-orbitron">Contato Direto</label>
                    <input 
                        required 
                        type="tel" 
                        name="telefone" 
                        id="telefone" 
                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-magic-blue focus:ring-2 focus:ring-magic-blue/20 outline-none transition-all"
                        placeholder="(00) 00000-0000"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="produto" className="block text-sm font-bold text-slate-700 font-orbitron">Protocolo de Interesse</label>
                    <div className="relative">
                        <select 
                            name="produto" 
                            id="produto" 
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-magic-blue focus:ring-2 focus:ring-magic-blue/20 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Selecione a estratégia...</option>
                            <option value="vida">Legado (Seguro Vida)</option>
                            <option value="auto">Mobilidade (Auto/Moto)</option>
                            <option value="frota">Mobilidade Empresarial (Frota)</option>
                            <option value="saude">Escudo Capital Humano (Saúde)</option>
                            <option value="consorcio">Aquisição Estratégica (Consórcio)</option>
                            <option value="outros">Outros</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-magic-blue">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="mensagem" className="block text-sm font-bold text-slate-700 font-orbitron">Briefing Inicial</label>
                <textarea 
                    name="mensagem" 
                    id="mensagem" 
                    rows={4} 
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-magic-blue focus:ring-2 focus:ring-magic-blue/20 outline-none transition-all"
                    placeholder="Descreva seus objetivos e necessidades atuais..."
                ></textarea>
            </div>

            <div className="space-y-2">
                <label htmlFor="anexos" className="block text-sm font-bold text-slate-700 font-orbitron">Documentação (Opcional)</label>
                <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 hover:bg-soft-blue transition-colors group text-center cursor-pointer">
                    <input 
                        type="file" 
                        id="anexos" 
                        multiple 
                        onChange={(e) => setFiles(e.target.files)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-magic-blue mx-auto mb-2 transition-colors" />
                    <p className="text-sm text-slate-500">
                        {files && files.length > 0 
                            ? <span className="text-magic-blue font-bold">{files.length} arquivo(s) selecionado(s)</span> 
                            : "Arraste arquivos ou clique para anexar (PDF, Imagens). Máx 5MB."}
                    </p>
                </div>
            </div>

            {status === 'error' && (
                <div className="flex items-center text-red-500 text-xs bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Erro ao processar solicitação. Verifique sua conexão.
                </div>
            )}

            <Button type="submit" fullWidth disabled={status === 'uploading'}>
                {status === 'uploading' ? 'Encriptando e Enviando...' : 'Solicitar Análise Estratégica'}
            </Button>
        </form>
    );
};