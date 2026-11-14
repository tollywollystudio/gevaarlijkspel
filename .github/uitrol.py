"""Reserve-uploader voor als lftp niet te installeren is.
Probeert SFTP (paramiko) en valt terug op versleuteld FTP met certificaatcontrole."""
import os, sys, ssl, ftplib

HOST = os.environ["SFTP_HOST"]; GEBRUIKER = os.environ["SFTP_GEBRUIKER"]; WACHTWOORD = os.environ["SFTP_WACHTWOORD"]
MAPPEN = ["domains/gevaarlijkspel.nl/public_html", "public_html", "private_html", "httpdocs", "www"]
SLA_OVER = {".git", ".github", "README.md", "tools"}

def bestanden():
    for basis, mappen, namen in os.walk("."):
        mappen[:] = [m for m in mappen if m not in SLA_OVER]
        for naam in namen:
            pad = os.path.normpath(os.path.join(basis, naam))
            if pad.split(os.sep)[0] not in SLA_OVER:
                yield pad.replace(os.sep, "/")

def via_sftp():
    import paramiko
    host, _, poort = HOST.partition(":")
    c = paramiko.SSHClient(); c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(host, port=int(poort or 22), username=GEBRUIKER, password=WACHTWOORD, timeout=20, allow_agent=False, look_for_keys=False)
    s = c.open_sftp()
    doel = None
    for m in MAPPEN:
        try: s.stat(m); doel = m; break
        except IOError: pass
    if not doel: raise SystemExit("Geen webmap gevonden via SFTP.")
    print("Verbonden via sftp. Webmap:", doel)
    gemaakt = set()
    for pad in bestanden():
        map_ = os.path.dirname(pad)
        if map_ and map_ not in gemaakt:
            deel = doel
            for stuk in map_.split("/"):
                deel += "/" + stuk
                try: s.stat(deel)
                except IOError: s.mkdir(deel)
            gemaakt.add(map_)
        s.put(pad, doel + "/" + pad); print("verstuurd", pad)
    s.close(); c.close()

def via_ftp():
    host, _, poort = HOST.partition(":")
    f = ftplib.FTP_TLS(context=ssl.create_default_context(), timeout=20)
    f.connect(host, int(poort) if poort and poort != "22" else 21)
    f.login(GEBRUIKER, WACHTWOORD); f.prot_p()
    start = f.pwd(); doel = None
    for m in MAPPEN:
        try: f.cwd(start); f.cwd(m); doel = m; break
        except ftplib.error_perm: pass
    if not doel: raise SystemExit("Geen webmap gevonden via FTP.")
    basis = f.pwd(); print("Verbonden via versleuteld FTP. Webmap:", doel)
    gemaakt = set()
    for pad in bestanden():
        map_ = os.path.dirname(pad)
        if map_ and map_ not in gemaakt:
            f.cwd(basis)
            for stuk in map_.split("/"):
                try: f.cwd(stuk)
                except ftplib.error_perm: f.mkd(stuk); f.cwd(stuk)
            gemaakt.add(map_)
        f.cwd(basis + ("/" + map_ if map_ else ""))
        with open(pad, "rb") as b: f.storbinary("STOR " + os.path.basename(pad), b)
        print("verstuurd", pad)
    f.quit()

try:
    via_sftp()
except SystemExit: raise
except Exception as fout:
    print("SFTP lukte niet (%s). Nu via versleuteld FTP:" % type(fout).__name__)
    via_ftp()
